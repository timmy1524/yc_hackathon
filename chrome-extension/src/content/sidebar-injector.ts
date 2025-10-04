class SidebarInjector {
  private sidebar: HTMLElement | null = null
  private isVisible = false
  private toggleButton: HTMLElement | null = null

  constructor() {
    this.init()
    this.setupToggleListener()
  }

  private init() {
    // Inject CSS animation for gradient
    this.injectGradientAnimation()
    
    // Create toggle button in LinkedIn UI
    this.createToggleButton()
    
    // Listen for extension icon clicks
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.action === 'toggleSidebar') {
        this.toggleSidebar()
        sendResponse({ success: true })
      }
    })
  }

  private injectGradientAnimation() {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `
    document.head.appendChild(style)
  }

  private createToggleButton() {
    // Create a tab with semicircular right edge for left sidebar, like Monica's design
    this.toggleButton = document.createElement('div')
    this.toggleButton.innerHTML = `
      <div class="ai-toggle-button" style="
        position: fixed;
        top: 50%;
        left: -18px;
        transform: translateY(-50%);
        width: 50px;
        height: 36px;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientShift 4s ease infinite;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-top-right-radius: 18px;
        border-bottom-right-radius: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 8px;
        box-shadow: -2px 0 8px rgba(0,0,0,0.15);
        z-index: 10000;
        transition: all 0.3s ease;
        border: 1px solid rgba(255,255,255,0.3);
        border-left: none;
      " title="LinkedIn AI Assistant">
        <div style="
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2d3748;
          font-weight: 700;
          font-size: 8px;
        ">AI</div>
      </div>
    `
    
    // Add hover effect - show full tab on hover
    const button = this.toggleButton.querySelector('.ai-toggle-button') as HTMLElement
    if (button) {
      button.addEventListener('mouseenter', () => {
        if (!this.isVisible) {
          button.style.left = '0px' // Show full tab on hover
        }
      })
      
      button.addEventListener('mouseleave', () => {
        if (!this.isVisible) {
          button.style.left = '-18px' // Back to showing full circular part
        }
      })
    }
    
    this.toggleButton.addEventListener('click', () => this.toggleSidebar())
    document.body.appendChild(this.toggleButton)
  }

  private async createSidebar() {
    if (this.sidebar) return

    // Create sidebar container
    this.sidebar = document.createElement('div')
    this.sidebar.id = 'linkedin-ai-sidebar'
    this.sidebar.style.cssText = `
      position: fixed;
      top: 0;
      left: -400px;
      width: 400px;
      height: 100vh;
      background: white;
      border-right: 1px solid #e5e7eb;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      z-index: 9999;
      transition: left 0.3s ease;
      overflow: hidden;
    `

    // Create iframe to load our React app
    const iframe = document.createElement('iframe')
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: white;
    `
    
    // Get the extension URL for our sidebar
    const sidebarUrl = chrome.runtime.getURL('src/sidebar/index.html')
    iframe.src = sidebarUrl

    this.sidebar.appendChild(iframe)
    document.body.appendChild(this.sidebar)

    // Handle iframe load
    iframe.onload = () => {
      console.log('LinkedIn AI Assistant sidebar loaded')
    }
  }

  private async toggleSidebar() {
    if (!this.sidebar) {
      await this.createSidebar()
    }

    if (this.isVisible) {
      this.hideSidebar()
    } else {
      this.showSidebar()
    }
  }

  private showSidebar() {
    if (!this.sidebar) return
    
    this.sidebar.style.left = '0px'
    this.isVisible = true
    
    // Update toggle button style - move it to the right edge of the sidebar
    const button = this.toggleButton?.querySelector('.ai-toggle-button') as HTMLElement
    if (button) {
      button.style.left = '400px' // Move to the right edge of the 400px sidebar
    }
  }

  private hideSidebar() {
    if (!this.sidebar) return
    
    this.sidebar.style.left = '-400px'
    this.isVisible = false
    
    // Update toggle button style - back to showing only circular part
    const button = this.toggleButton?.querySelector('.ai-toggle-button') as HTMLElement
    if (button) {
      button.style.left = '-18px' // Move back to showing full circular part
    }
  }

  private setupToggleListener() {
    // Listen for extension icon clicks via background script
    document.addEventListener('linkedin-ai-toggle', () => {
      this.toggleSidebar()
    })
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SidebarInjector()
  })
} else {
  new SidebarInjector()
}