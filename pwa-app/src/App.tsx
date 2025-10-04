import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoginScreen from '@/components/LoginScreen'
import RecordingScreen from '@/components/RecordingScreen'
import SuccessScreen from '@/components/SuccessScreen'
import ProcessingScreen from '@/components/ProcessingScreen'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-linkedin-600 to-linkedin-700 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-linkedin-600 to-linkedin-700">
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<RecordingScreen />} />
              <Route path="/processing/:conversationId" element={<ProcessingScreen />} />
              <Route path="/success/:conversationId" element={<SuccessScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App