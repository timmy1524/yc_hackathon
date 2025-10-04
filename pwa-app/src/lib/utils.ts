export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function extractLinkedInProfileData(url: string): { name?: string; title?: string; company?: string } {
  // This would normally parse LinkedIn QR code data or profile URL
  // For demo purposes, return empty object
  return {}
}

export function validateLinkedInUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname === 'www.linkedin.com' && urlObj.pathname.startsWith('/in/')
  } catch {
    return false
  }
}

export function generateUniqueId(): string {
  return crypto.randomUUID()
}