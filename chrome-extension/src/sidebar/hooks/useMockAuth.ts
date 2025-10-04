import { useState } from 'react'

interface MockUser {
  id: string
  email: string
  name: string
}

const MOCK_USER: MockUser = {
  id: 'user-1',
  email: 'demo@example.com',
  name: 'Demo User'
}

export function useMockAuth() {
  // Toggle this between MOCK_USER and null to test different states
  const [user] = useState<MockUser | null>(MOCK_USER)  // Set to null to test login prompt
  const [loading] = useState(false)

  // For demo purposes, you can toggle between logged in and logged out
  // Change MOCK_USER to null above to test the login prompt
  
  return { user, loading }
}