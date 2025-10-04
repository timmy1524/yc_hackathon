import { Building, MapPin, User } from 'lucide-react'
import { Contact } from '@/types'

interface ContactDisplayProps {
  contact: Partial<Contact>
}

export default function ContactDisplay({ contact }: ContactDisplayProps) {
  const { name, linkedin_profile_data } = contact
  const { title, company, location } = linkedin_profile_data || {}

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-linkedin-600 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {name || 'LinkedIn Contact'}
          </h3>
          
          {title && (
            <div className="flex items-center gap-1 mt-1">
              <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600 truncate">
                {title}
                {company && ` at ${company}`}
              </p>
            </div>
          )}
          
          {location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-500 truncate">{location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}