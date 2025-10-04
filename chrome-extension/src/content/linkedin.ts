import { SELECTORS } from './selectors'
import { MessageData, MessageFromBackground } from '@/types'

class LinkedInContentScript {
  private observer: MutationObserver | null = null
  private isMonitoring = false

  constructor() {
    this.initializeMonitoring()
    this.setupMessageListener()
  }

  private initializeMonitoring() {
    if (this.isMonitoring) return

    const messageContainer = document.querySelector(SELECTORS.messageList)
    if (!messageContainer) {
      // Retry after a delay if messages container not found
      setTimeout(() => this.initializeMonitoring(), 2000)
      return
    }

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            if (this.isNewIncomingMessage(element)) {
              this.handleNewMessage(element)
            }
          }
        })
      })
    })

    this.observer.observe(messageContainer, {
      childList: true,
      subtree: true
    })

    this.isMonitoring = true
    console.log('LinkedIn AI Assistant: Content script initialized')
  }

  private isNewIncomingMessage(element: Element): boolean {
    return element.matches(SELECTORS.incomingMessage) || 
           element.querySelector(SELECTORS.incomingMessage) !== null
  }

  private extractMessageData(element: Element): MessageData | null {
    try {
      const messageElement = element.matches(SELECTORS.incomingMessage) 
        ? element 
        : element.querySelector(SELECTORS.incomingMessage)

      if (!messageElement) return null

      const messageTextElement = messageElement.querySelector(SELECTORS.messageText)
      const senderProfileElement = messageElement.querySelector(SELECTORS.senderProfile)

      if (!messageTextElement || !senderProfileElement) return null

      const messageText = messageTextElement.textContent?.trim() || ''
      const senderLinkedInUrl = (senderProfileElement as HTMLAnchorElement).href || ''
      const senderName = senderProfileElement.getAttribute('aria-label') || 
                        senderProfileElement.textContent?.trim() || 'Unknown'

      return {
        senderName,
        senderLinkedInUrl,
        messageText,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error extracting message data:', error)
      return null
    }
  }

  private handleNewMessage(element: Element) {
    const messageData = this.extractMessageData(element)
    if (!messageData) return

    // Send to background script
    chrome.runtime.sendMessage({
      type: 'NEW_MESSAGE',
      data: messageData
    }).catch((error) => {
      console.error('Error sending message to background:', error)
    })
  }

  private setupMessageListener() {
    chrome.runtime.onMessage.addListener((message: MessageFromBackground, sender, sendResponse) => {
      switch (message.type) {
        case 'SEND_REPLY':
          this.sendLinkedInMessage(message.data.message)
          break
        case 'SEND_CONNECTION_REQUEST':
          this.sendConnectionRequest(message.data.profileUrl, message.data.message)
          break
      }
      sendResponse({ success: true })
    })
  }

  private async sendLinkedInMessage(text: string): Promise<boolean> {
    try {
      const messageBox = document.querySelector(SELECTORS.messageBox) as HTMLElement
      const sendButton = document.querySelector(SELECTORS.sendButton) as HTMLButtonElement

      if (!messageBox || !sendButton) {
        console.error('Message box or send button not found')
        return false
      }

      // Focus and clear the message box
      messageBox.focus()
      messageBox.innerText = text

      // Trigger input event to enable send button
      const inputEvent = new Event('input', { bubbles: true })
      messageBox.dispatchEvent(inputEvent)

      // Wait a moment for UI to update
      await this.sleep(500)

      // Click send button
      if (!sendButton.disabled) {
        sendButton.click()
        return true
      }

      return false
    } catch (error) {
      console.error('Error sending LinkedIn message:', error)
      return false
    }
  }

  private async sendConnectionRequest(profileUrl: string, message: string): Promise<boolean> {
    try {
      // Navigate to profile if not already there
      if (window.location.href !== profileUrl) {
        window.location.href = profileUrl
        await this.waitForPageLoad()
      }

      // Find and click connect button
      const connectButton = document.querySelector(SELECTORS.connectButton) as HTMLButtonElement
      if (!connectButton) {
        console.error('Connect button not found')
        return false
      }

      connectButton.click()
      await this.sleep(1000)

      // Look for "Add a note" option
      const addNoteButton = document.querySelector(SELECTORS.connectWithNoteButton) as HTMLButtonElement
      if (addNoteButton && message) {
        addNoteButton.click()
        await this.sleep(500)

        // Add custom message
        const noteTextarea = document.querySelector(SELECTORS.noteTextarea) as HTMLTextAreaElement
        if (noteTextarea) {
          noteTextarea.value = message
          noteTextarea.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }

      // Send invitation
      const sendInviteButton = document.querySelector(SELECTORS.sendInviteButton) as HTMLButtonElement
      if (sendInviteButton && !sendInviteButton.disabled) {
        sendInviteButton.click()
        return true
      }

      return false
    } catch (error) {
      console.error('Error sending connection request:', error)
      return false
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
      } else {
        window.addEventListener('load', () => resolve())
      }
    })
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.isMonitoring = false
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LinkedInContentScript()
  })
} else {
  new LinkedInContentScript()
}