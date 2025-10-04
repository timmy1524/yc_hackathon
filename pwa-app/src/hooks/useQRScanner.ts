import { useState, useCallback } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { QRScanResult } from '@/types'
import { validateLinkedInUrl, extractLinkedInProfileData } from '@/lib/utils'

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startScanner = useCallback((
    elementId: string,
    onScanSuccess: (result: QRScanResult) => void
  ) => {
    setIsScanning(true)
    setError(null)

    const scanner = new Html5QrcodeScanner(
      elementId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    )

    scanner.render(
      (decodedText) => {
        // Check if it's a LinkedIn URL
        if (validateLinkedInUrl(decodedText)) {
          const profileData = extractLinkedInProfileData(decodedText)
          onScanSuccess({
            linkedinUrl: decodedText,
            ...profileData,
          })
          scanner.clear()
          setIsScanning(false)
        } else {
          setError('Please scan a valid LinkedIn QR code')
        }
      },
      (errorMessage) => {
        // Handle scan failure - usually ignore unless it's a permission error
        if (errorMessage.includes('Permission')) {
          setError('Camera permission denied. Please allow camera access.')
          setIsScanning(false)
        }
      }
    )

    return () => {
      scanner.clear().catch(console.error)
      setIsScanning(false)
    }
  }, [])

  const stopScanner = useCallback(() => {
    setIsScanning(false)
    setError(null)
  }, [])

  return {
    isScanning,
    error,
    startScanner,
    stopScanner,
  }
}