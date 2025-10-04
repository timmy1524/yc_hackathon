import { ExternalLink, Linkedin } from 'lucide-react'

export default function LoginPrompt() {
  const openPWAApp = () => {
    chrome.tabs.create({ url: 'https://your-pwa-app-url.com' })
  }

  return (
    <div className="w-96 h-[600px] bg-white flex flex-col items-center justify-center p-6 text-center shadow-lg">
      <div className="bg-linkedin-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <Linkedin className="w-8 h-8 text-white" />
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        LinkedIn AI Assistant
      </h2>
      
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        Please sign in using the mobile app to view your contacts and manage AI automation settings.
      </p>
      
      <button
        onClick={openPWAApp}
        className="flex items-center gap-2 bg-linkedin-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-linkedin-700 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Open Mobile App
      </button>
      
      <p className="text-xs text-gray-500 mt-4">
        Sign in on the mobile app, then refresh this extension
      </p>
    </div>
  )
}