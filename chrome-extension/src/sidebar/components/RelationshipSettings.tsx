import { useState } from 'react'
import { Save, Users } from 'lucide-react'
import { Contact } from '@/types'

interface RelationshipSettingsProps {
  contact: Contact
  onUpdate: (contactId: string, updates: Partial<Contact>) => void
}

const RELATIONSHIP_TYPES = [
  { value: 'potential_client', label: 'Potential Client' },
  { value: 'professional_contact', label: 'Professional Contact' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'other', label: 'Other' }
] as const

export default function RelationshipSettings({ contact, onUpdate }: RelationshipSettingsProps) {
  const [relationshipType, setRelationshipType] = useState(contact.relationship_type)
  const [customInstructions, setCustomInstructions] = useState(contact.custom_instructions || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onUpdate(contact.id, {
        relationship_type: relationshipType,
        custom_instructions: customInstructions.trim() || null
      })
    } catch (error) {
      console.error('Error updating relationship settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = relationshipType !== contact.relationship_type || 
                    customInstructions !== (contact.custom_instructions || '')

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-linkedin-100 w-10 h-10 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-linkedin-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Relationship Settings</h3>
          <p className="text-sm text-gray-600">Configure how AI interacts with this contact</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Relationship Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship Type
          </label>
          <select
            value={relationshipType}
            onChange={(e) => setRelationshipType(e.target.value as Contact['relationship_type'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-600 focus:border-transparent text-sm"
          >
            {RELATIONSHIP_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom AI Instructions
          </label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Tell AI how to respond to this contact... (e.g., 'Be formal and professional', 'Mention our upcoming project', 'Keep responses brief')"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-600 focus:border-transparent text-sm resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            These instructions will guide how AI responds to messages from this contact
          </p>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-linkedin-600 text-white text-sm rounded-lg hover:bg-linkedin-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  )
}