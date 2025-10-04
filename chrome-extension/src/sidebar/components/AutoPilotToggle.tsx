import { useState } from 'react'
import { Bot, AlertTriangle } from 'lucide-react'
import { Contact } from '@/types'

interface AutoPilotToggleProps {
  contact: Contact
  onUpdate: (contactId: string, updates: Partial<Contact>) => void
}

export default function AutoPilotToggle({ contact, onUpdate }: AutoPilotToggleProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleToggle = async () => {
    if (!contact.auto_pilot_enabled) {
      setShowConfirmation(true)
      return
    }

    // Disable auto-pilot directly
    await updateAutoPilot(false)
  }

  const updateAutoPilot = async (enabled: boolean) => {
    setUpdating(true)
    try {
      await onUpdate(contact.id, { auto_pilot_enabled: enabled })
      setShowConfirmation(false)
    } catch (error) {
      console.error('Error updating auto-pilot:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="bg-white border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2">Enable Auto-Pilot?</h3>
            <p className="text-sm text-gray-600 mb-4">
              AI will automatically respond to LinkedIn messages from {contact.name} based on your conversation history and custom instructions.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => updateAutoPilot(true)}
                disabled={updating}
                className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {updating ? 'Enabling...' : 'Enable'}
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            contact.auto_pilot_enabled ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Bot className={`w-5 h-5 ${
              contact.auto_pilot_enabled ? 'text-green-600' : 'text-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">AI Auto-Pilot</h3>
            <p className="text-sm text-gray-600">
              {contact.auto_pilot_enabled 
                ? 'AI will respond automatically' 
                : 'Manual responses only'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={updating}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-linkedin-600 focus:ring-offset-2 ${
            contact.auto_pilot_enabled ? 'bg-green-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              contact.auto_pilot_enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {contact.auto_pilot_enabled && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">Auto-Pilot Active</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            AI will automatically respond to messages from this contact
          </p>
        </div>
      )}
    </div>
  )
}