import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useSupabase } from '@/hooks/useSupabase'
import { Contact, QRScanResult } from '@/types'
import QRScanner from './QRScanner'
import ContactDisplay from './ContactDisplay'
import RecordButton from './RecordButton'
import AudioWaveform from './AudioWaveform'

export default function RecordingScreen() {
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [contact, setContact] = useState<Partial<Contact> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { user, signOut } = useAuth()
  const { isRecording, duration, audioBlob, startRecording, stopRecording, resetRecording } = useAudioRecorder()
  const { createContact, createConversation, uploadAudio, processAudio, loading } = useSupabase()
  const navigate = useNavigate()

  const handleQRScan = async (result: QRScanResult) => {
    setShowQRScanner(false)
    setError(null)

    try {
      // Create contact in database
      const newContact = await createContact({
        name: result.name || 'LinkedIn Contact',
        linkedin_url: result.linkedinUrl,
        linkedin_profile_data: {
          title: result.title,
          company: result.company,
        },
      })

      if (newContact) {
        setContact(newContact)
      } else {
        setError('Failed to create contact')
      }
    } catch (err) {
      setError('Failed to process contact')
    }
  }

  const handleStartRecording = async () => {
    try {
      setError(null)
      await startRecording()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording')
    }
  }

  const handleStopRecording = async () => {
    if (!contact || !audioBlob) return

    try {
      stopRecording()
      setError(null)

      // Create conversation record
      const conversation = await createConversation({
        contact_id: contact.id!,
        duration_seconds: duration,
      })

      if (!conversation) {
        throw new Error('Failed to create conversation')
      }

      // Upload audio file
      const fileName = `${user?.id}/${Date.now()}.webm`
      const audioUrl = await uploadAudio(audioBlob, fileName)

      if (!audioUrl) {
        throw new Error('Failed to upload audio')
      }

      // Update conversation with audio URL
      // Navigate to processing screen
      navigate(`/processing/${conversation.id}`)

      // Start AI processing in background
      processAudio(audioUrl, contact.id!, conversation.id)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process recording')
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const canRecord = contact && !loading

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">LinkedIn AI Assistant</h1>
        <button
          onClick={handleSignOut}
          className="text-white/80 hover:text-white p-2"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto w-full">
        {!contact ? (
          /* No Contact State */
          <div className="text-center space-y-6">
            <div className="bg-white/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Scan a LinkedIn QR Code
              </h2>
              <p className="text-white/80">
                Start by scanning your contact's LinkedIn QR code to begin recording your conversation.
              </p>
            </div>
            <button
              onClick={() => setShowQRScanner(true)}
              className="bg-white text-linkedin-600 px-8 py-4 rounded-xl font-semibold flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <QrCode className="w-6 h-6" />
              Scan QR Code
            </button>
          </div>
        ) : (
          /* Contact Selected State */
          <div className="w-full space-y-6">
            {/* Contact Info */}
            <ContactDisplay contact={contact} />

            {/* Recording Controls */}
            <div className="text-center space-y-6">
              <AudioWaveform isRecording={isRecording} />
              
              <RecordButton
                isRecording={isRecording}
                duration={duration}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
                disabled={!canRecord}
              />
            </div>

            {/* Reset Button */}
            {!isRecording && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setContact(null)
                    resetRecording()
                  }}
                  className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/30"
                >
                  Change Contact
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="w-full bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-100 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  )
}