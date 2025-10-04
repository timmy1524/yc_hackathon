import { useEffect } from 'react'
import { X, Camera } from 'lucide-react'
import { useQRScanner } from '@/hooks/useQRScanner'
import { QRScanResult } from '@/types'

interface QRScannerProps {
  onScan: (result: QRScanResult) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const { isScanning, error, startScanner, stopScanner } = useQRScanner()

  useEffect(() => {
    const cleanup = startScanner('qr-reader', onScan)
    return cleanup
  }, [startScanner, onScan])

  const handleClose = () => {
    stopScanner()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-linkedin-600 w-10 h-10 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Scan LinkedIn QR Code</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Point your camera at a LinkedIn QR code to automatically add the contact.
          </p>

          <div 
            id="qr-reader" 
            className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {isScanning && (
            <p className="text-sm text-gray-500 text-center">
              Scanning for QR code...
            </p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}