interface ConnectionData {
  date_met: string
  meeting_event: string
  conversation_summary: string
  follow_up_message: string
  future_potential: string
}

class LinkedInProfileInjector {
  private observer: MutationObserver | null = null
  private injectedSections = new Set<string>()

  constructor() {
    this.init()
  }

  private init() {
    console.log('[LinkedIn Profile Injector] Initializing...')
    console.log('[LinkedIn Profile Injector] Current URL:', window.location.href)
    console.log('[LinkedIn Profile Injector] Is profile page:', this.isProfilePage(window.location.href))

    // Run immediately if page is already loaded
    if (document.readyState === 'complete') {
      this.injectConnectionReason()
    }

    // Watch for navigation changes (LinkedIn is a SPA)
    this.setupNavigationObserver()

    // Also listen for page load
    window.addEventListener('load', () => {
      console.log('[LinkedIn Profile Injector] Page loaded')
      this.injectConnectionReason()
    })
  }

  private setupNavigationObserver() {
    // Watch for URL changes in SPA
    let lastUrl = location.href
    new MutationObserver(() => {
      const currentUrl = location.href
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl
        if (this.isProfilePage(currentUrl)) {
          // Wait for profile content to load
          setTimeout(() => this.injectConnectionReason(), 1000)
        }
      }
    }).observe(document.body, { subtree: true, childList: true })

    // Also observe the main content area for changes
    this.observer = new MutationObserver(() => {
      if (this.isProfilePage(window.location.href)) {
        this.injectConnectionReason()
      }
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  private isProfilePage(url: string): boolean {
    return url.includes('/in/') && !url.includes('/messaging')
  }

  private async injectConnectionReason() {
    console.log('[LinkedIn Profile Injector] Attempting to inject...')

    if (!this.isProfilePage(window.location.href)) {
      console.log('[LinkedIn Profile Injector] Not a profile page, skipping')
      return
    }

    // Try multiple selectors for profile header
    const selectors = [
      '.pv-top-card',
      '.ph5.pb5',
      'section[data-view-name="profile-card"]',
      '.scaffold-layout__main > div:first-child',
      'main .artdeco-card'
    ]

    let profileHeader = null
    for (const selector of selectors) {
      profileHeader = document.querySelector(selector)
      if (profileHeader) {
        console.log('[LinkedIn Profile Injector] Found profile header with selector:', selector)
        break
      }
    }

    if (!profileHeader) {
      console.log('[LinkedIn Profile Injector] Profile header not found. Available classes:',
        Array.from(document.querySelectorAll('main *')).slice(0, 5).map(el => el.className))
      return
    }

    // Create a unique ID for this profile to avoid duplicate injections
    const profileId = window.location.pathname
    if (this.injectedSections.has(profileId)) {
      console.log('[LinkedIn Profile Injector] Already injected for this profile')
      return
    }

    // Check if our section already exists
    if (document.querySelector('#ai-connection-reason-section')) {
      console.log('[LinkedIn Profile Injector] Section already exists in DOM')
      this.injectedSections.add(profileId)
      return
    }

    // Get connection data from background script or API
    const connectionData = await this.fetchConnectionData()

    // Create all sections
    const sections = [
      this.createConnectionReasonSection(connectionData),
      this.createFollowUpMessageSection(connectionData.follow_up_message),
      this.createFuturePotentialSection(connectionData.future_potential)
    ]

    // Find the insertion point (after the profile header)
    const insertionPoint = this.findInsertionPoint()
    console.log('[LinkedIn Profile Injector] Insertion point:', insertionPoint?.className)

    if (insertionPoint) {
      // Insert all sections in order
      let currentInsertionPoint = insertionPoint
      sections.forEach(section => {
        currentInsertionPoint.insertAdjacentElement('afterend', section)
        currentInsertionPoint = section
      })
      this.injectedSections.add(profileId)
      console.log('[LinkedIn Profile Injector] ✅ All sections injected successfully!')
    } else {
      console.log('[LinkedIn Profile Injector] ❌ No insertion point found')
    }
  }

  private findInsertionPoint(): Element | null {
    // Find the entire profile card container - we want to insert AFTER the whole card
    const strategies = [
      // Strategy 1: Find the profile top card and go up to the full card wrapper
      () => {
        const topCard = document.querySelector('.pv-top-card')
        if (topCard) {
          // Find the outermost card container (artdeco-card or similar)
          let parent = topCard.parentElement
          while (parent) {
            if (parent.classList.contains('artdeco-card') ||
                parent.classList.contains('pvs-list__container') ||
                parent.tagName === 'SECTION') {
              return parent
            }
            parent = parent.parentElement
            // Don't go beyond scaffold-layout__main
            if (parent?.classList.contains('scaffold-layout__main')) {
              break
            }
          }
          // If not found, return the closest section/card
          return topCard.closest('section, .artdeco-card')
        }
        return null
      },
      // Strategy 2: Find first direct child of main content
      () => {
        const main = document.querySelector('.scaffold-layout__main')
        return main?.children[0] as Element
      },
      // Strategy 3: First card in main
      () => document.querySelector('main .artdeco-card:first-of-type'),
    ]

    for (const strategy of strategies) {
      const element = strategy()
      if (element) {
        console.log('[LinkedIn Profile Injector] Found insertion point:', element.tagName, element.className)
        return element
      }
    }

    return null
  }

  private async fetchConnectionData(): Promise<ConnectionData> {
    // TODO: Replace with actual API call to get connection data
    // For now, return mock data
    return {
      date_met: "Sep 10/2025",
      meeting_event: "YC HACKATHON",
      conversation_summary: "You both are interested in AI and machine learning, particularly in building automation tools for professional networking. You share mutual connections including Bryan Kim and Thorsten Schaeff, who work in similar fields.",
      follow_up_message: "Mock follow-up message content will be loaded from backend API.",
      future_potential: "Mock future potential content will be loaded from backend API."
    }
  }

  private createConnectionReasonSection(data: ConnectionData): HTMLElement {
    const section = document.createElement('div')
    section.id = 'ai-connection-reason-section'
    section.className = 'artdeco-card pv-profile-card'
    section.style.cssText = `
      margin-top: 8px;
      margin-bottom: 8px;
      padding: 24px;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
    `

    section.innerHTML = `
      <div class="ai-connection-reason-container">
        <h2 class="ai-connection-reason-title" style="
          font-size: 24px;
          font-weight: 600;
          color: #000000;
          margin: 0 0 16px 0;
          line-height: 1.5;
        ">
          How you guys Got to know each other
        </h2>
        <div style="display: flex; gap: 100px; margin-bottom: 16px;">
          <div>
            <strong style="font-weight: 600;">date_met</strong>
            <span style="margin-left: 16px;">${data.date_met}</span>
          </div>
          <div>
            <strong style="font-weight: 600;">meeting_event</strong>
            <span style="margin-left: 16px;">${data.meeting_event}</span>
          </div>
        </div>
        <div>
          <strong style="font-weight: 600; display: block; margin-bottom: 8px;">conversation_summary</strong>
          <div style="font-size: 14px; line-height: 1.6; color: rgba(0, 0, 0, 0.9);">
            ${data.conversation_summary}
          </div>
        </div>
      </div>
    `

    return section
  }

  private createFollowUpMessageSection(message: string): HTMLElement {
    const section = document.createElement('div')
    section.id = 'ai-followup-message-section'
    section.className = 'artdeco-card pv-profile-card'
    section.style.cssText = `
      margin-top: 8px;
      margin-bottom: 8px;
      padding: 24px;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
    `

    section.innerHTML = `
      <div class="ai-followup-message-container">
        <h2 style="
          font-size: 24px;
          font-weight: 600;
          color: #000000;
          margin: 0 0 16px 0;
          line-height: 1.5;
        ">
          Suggestion to follow up message
        </h2>
        <div style="
          font-size: 14px;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.9);
          margin-bottom: 20px;
        ">
          ${message}
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="regenerate-btn" style="
            padding: 10px 24px;
            border: 1px solid #0a66c2;
            background: white;
            color: #0a66c2;
            border-radius: 24px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
          ">
            Regenerate
          </button>
          <button class="copy-message-btn" style="
            padding: 10px 24px;
            border: none;
            background: #0a66c2;
            color: white;
            border-radius: 24px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
          ">
            Copy message
          </button>
        </div>
      </div>
    `

    // Add event listeners
    const regenerateBtn = section.querySelector('.regenerate-btn')
    const copyBtn = section.querySelector('.copy-message-btn')

    regenerateBtn?.addEventListener('click', () => {
      console.log('[LinkedIn Profile Injector] Regenerate button clicked')
      // TODO: Call API to regenerate message
    })

    copyBtn?.addEventListener('click', () => {
      console.log('[LinkedIn Profile Injector] Copy message button clicked')
      navigator.clipboard.writeText(message)
      // TODO: Show toast notification
    })

    return section
  }

  private createFuturePotentialSection(potential: string): HTMLElement {
    const section = document.createElement('div')
    section.id = 'ai-future-potential-section'
    section.className = 'artdeco-card pv-profile-card'
    section.style.cssText = `
      margin-top: 8px;
      margin-bottom: 8px;
      padding: 24px;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
    `

    section.innerHTML = `
      <div class="ai-future-potential-container">
        <h2 style="
          font-size: 24px;
          font-weight: 600;
          color: #000000;
          margin: 0 0 16px 0;
          line-height: 1.5;
        ">
          Future potential
        </h2>
        <div style="
          font-size: 14px;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.9);
        ">
          ${potential}
        </div>
      </div>
    `

    return section
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.injectedSections.clear()
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LinkedInProfileInjector()
  })
} else {
  new LinkedInProfileInjector()
}

export default LinkedInProfileInjector
