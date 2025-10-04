import { useState, useRef, useCallback } from 'react'
import { AudioRecordingState } from '@/types'

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    duration: 0,
    audioBlob: null,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setState(prev => ({ ...prev, audioBlob, isRecording: false }))
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.start(1000) // Collect data every second

      setState(prev => ({ ...prev, isRecording: true, duration: 0 }))

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }))
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      throw new Error('Failed to start recording. Please check microphone permissions.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resetRecording = useCallback(() => {
    stopRecording()
    setState({
      isRecording: false,
      duration: 0,
      audioBlob: null,
    })
    chunksRef.current = []
  }, [stopRecording])

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  }
}