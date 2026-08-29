export type MediaKind = 'video' | 'audio' | 'image'

export type MediaMetadata = {
  kind: MediaKind
  mimeType: string
  duration: number
  width: number
  height: number
}

function kindFromMime(mime: string): MediaKind | null {
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime.startsWith('image/')) return 'image'
  return null
}

export async function readMediaMetadata(file: File): Promise<MediaMetadata> {
  const kind = kindFromMime(file.type)
  if (!kind) throw new Error(`Unsupported media type: ${file.type || 'unknown'}`)
  const url = URL.createObjectURL(file)
  try {
    if (kind === 'image') {
      const image = new Image()
      image.src = url
      await image.decode()
      return { kind, mimeType: file.type, duration: 0, width: image.naturalWidth, height: image.naturalHeight }
    }
    const element = document.createElement(kind === 'video' ? 'video' : 'audio')
    element.preload = 'metadata'
    element.src = url
    await new Promise<void>((resolve, reject) => {
      element.onloadedmetadata = () => resolve()
      element.onerror = () => reject(new Error('Could not read media metadata.'))
    })
    return {
      kind,
      mimeType: file.type,
      duration: Number.isFinite(element.duration) ? element.duration : 0,
      width: kind === 'video' ? element.videoWidth : 0,
      height: kind === 'video' ? element.videoHeight : 0,
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function isSupportedMedia(file: File) {
  return Boolean(kindFromMime(file.type))
}
