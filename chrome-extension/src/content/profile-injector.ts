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
    // Watch for URL changes in SPA (single observer to prevent duplicates)
    let lastUrl = location.href
    this.observer = new MutationObserver(() => {
      const currentUrl = location.href
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl
        if (this.isProfilePage(currentUrl)) {
          // Wait for profile content to load, then inject once
          setTimeout(() => this.injectConnectionReason(), 1000)
        }
      }
    })

    this.observer.observe(document.body, { subtree: true, childList: true })
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

    // IMPORTANT: Only proceed if this person is in our contacts database
    const connectionData = await this.fetchConnectionData()
    if (!connectionData) {
      console.log('[LinkedIn Profile Injector] This person is not in contacts database, skipping injection')
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

  private async fetchConnectionData(): Promise<ConnectionData | null> {
    try {
      // Get current LinkedIn profile URL
      const currentProfileUrl = window.location.href
      
      // Extract clean LinkedIn profile URL (remove query params and fragments)
      const cleanUrl = currentProfileUrl.split('?')[0].split('#')[0]
      
      console.log('[LinkedIn Profile Injector] Checking for contact with URL:', cleanUrl)
      
      // Call the same API that the sidebar uses
      const SUPABASE_URL = 'https://shktirpoweaqcvvleldo.supabase.co'
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoa3RpcnBvd2VhcWN2dmxlbGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1OTQ4MzMsImV4cCI6MjA3NTE3MDgzM30.SJDU3hDL4N7jbhT7Kqp6JuNKjIXWAG3nKMoMk5wuz8w'
      
      const url = `${SUPABASE_URL}/functions/v1/chrome-get-contacts?user_name=Yilun&user_email=yilunsun@gmail.com`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.error('[LinkedIn Profile Injector] API request failed:', response.status, response.statusText)
        return null
      }

      const data = await response.json()
      
      if (data.status !== 'success') {
        console.error('[LinkedIn Profile Injector] API returned error:', data.message)
        return null
      }

      // Check if current profile URL matches any contact from the API
      const contact = data.contacts.find((contact: any) => 
        cleanUrl.includes(contact.profile_url.replace('https://www.linkedin.com', ''))
      )
      
      if (!contact) {
        console.log('[LinkedIn Profile Injector] No matching contact found in database')
        return null
      }
      
      console.log('[LinkedIn Profile Injector] Found matching contact:', contact.profile_url)
      
      // Return the connection data using API response fields
      const connectionData = {
        date_met: contact.date_met,
        meeting_event: contact.meeting_event,
        conversation_summary: contact.conversation_summary,
        follow_up_message: contact.follow_up_suggestion,
        future_potential: contact.future_potential
      }
      
      console.log('[LinkedIn Profile Injector] Returning connection data:', connectionData)
      return connectionData
      
    } catch (error) {
      console.error('[LinkedIn Profile Injector] Error fetching connection data:', error)
      return null
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
