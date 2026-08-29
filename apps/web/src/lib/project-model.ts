export const CLIPORA_PROJECT_VERSION = 1 as const

export type CaptionStyle = 'classic' | 'bold' | 'karaoke' | 'minimal'

export type MediaAsset = {
  id: string
  name: string
  type: 'video' | 'audio' | 'image'
  mimeType: string
  duration: number
  size: number
  createdAt: string
}

export type CaptionWord = {
  id: string
  text: string
  start: number
  end: number
}

export type CaptionSegment = {
  id: string
  text: string
  start: number
  end: number
  words: CaptionWord[]
  style: CaptionStyle
}

export type TimelineClip = {
  id: string
  assetId: string
  start: number
  duration: number
  offset: number
}

export type CliporaProject = {
  version: typeof CLIPORA_PROJECT_VERSION
  type: 'clipora-project'
  id: string
  name: string
  createdAt: string
  updatedAt: string
  duration: number
  assets: MediaAsset[]
  clips: TimelineClip[]
  captions: CaptionSegment[]
}

export function createProject(name = 'Untitled Clipora Project'): CliporaProject {
  const now = new Date().toISOString()
  return {
    version: CLIPORA_PROJECT_VERSION,
    type: 'clipora-project',
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
    duration: 0,
    assets: [],
    clips: [],
    captions: [],
  }
}

export function validateProject(value: unknown): value is CliporaProject {
  if (!value || typeof value !== 'object') return false
  const project = value as Partial<CliporaProject>
  return project.type === 'clipora-project'
    && project.version === CLIPORA_PROJECT_VERSION
    && typeof project.id === 'string'
    && typeof project.name === 'string'
    && Array.isArray(project.assets)
    && Array.isArray(project.clips)
    && Array.isArray(project.captions)
}
