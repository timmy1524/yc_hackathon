import { Building, Calendar, ArrowRight } from 'lucide-react'
import { Contact } from '@/types'

interface ContactCardProps {
  contact: Contact
  onClick: () => void
}

export default function ContactCard({ contact, onClick }: ContactCardProps) {
  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'not_contacted':
        return 'bg-gray-100 text-gray-700'
      case 'connection_sent':
        return 'bg-yellow-100 text-yellow-700'
      case 'connected':
        return 'bg-green-100 text-green-700'
      case 'declined':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: Contact['status']) => {
    switch (status) {
      case 'not_contacted':
        return 'NEW'
      case 'connection_sent':
        return 'SENT'
      case 'connected':
        return 'CONNECTED'
      case 'declined':
        return 'DECLINED'
      default:
        return 'UNKNOWN'
    }
  }

  return (
    <div
      onClick={onClick}
      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {contact.name}
          </h3>
          {contact.linkedin_profile_data?.title && (
            <div className="flex items-center gap-1 mt-1">
              <Building className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-600 truncate">
                {contact.linkedin_profile_data.title}
                {contact.linkedin_profile_data.company && 
                  ` at ${contact.linkedin_profile_data.company}`
                }
              </p>
            </div>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(contact.status)}`}>
          {getStatusText(contact.status)}
        </span>
        
        {contact.auto_pilot_enabled && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">AUTO</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 mt-2">
        <Calendar className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-500">
          {new Date(contact.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}