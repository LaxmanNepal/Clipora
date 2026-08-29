import type { CliporaProject, TimelineClip } from './project-model'

export type TimelineAction =
  | { type: 'move'; clipId: string; start: number }
  | { type: 'trim'; clipId: string; start: number; duration: number; offset: number }
  | { type: 'delete'; clipId: string }

export function updateTimeline(project: CliporaProject, action: TimelineAction): CliporaProject {
  const clips = project.clips
  let next = clips
  if (action.type === 'move') {
    next = clips.map(c => c.id === action.clipId ? { ...c, start: Math.max(0, action.start) } : c)
  } else if (action.type === 'trim') {
    next = clips.map(c => c.id === action.clipId ? { ...c, start: Math.max(0, action.start), duration: Math.max(0.05, action.duration), offset: Math.max(0, action.offset) } : c)
  } else if (action.type === 'delete') {
    next = clips.filter(c => c.id !== action.clipId)
  }
  const duration = next.reduce((max, c) => Math.max(max, c.start + c.duration), 0)
  return { ...project, clips: next, duration, updatedAt: new Date().toISOString() }
}

export function moveClip(project: CliporaProject, clipId: string, start: number) {
  return updateTimeline(project, { type: 'move', clipId, start })
}

export function trimClip(project: CliporaProject, clipId: string, start: number, duration: number, offset: number) {
  return updateTimeline(project, { type: 'trim', clipId, start, duration, offset })
}

export function deleteClip(project: CliporaProject, clipId: string) {
  return updateTimeline(project, { type: 'delete', clipId })
}

export function splitClip(project: CliporaProject, clipId: string, at: number): CliporaProject {
  const clip = project.clips.find(c => c.id === clipId)
  if (!clip) return project
  const local = at - clip.start
  if (local <= 0.05 || local >= clip.duration - 0.05) return project
  const left: TimelineClip = { ...clip, id: crypto.randomUUID(), duration: local }
  const right: TimelineClip = { ...clip, id: crypto.randomUUID(), start: at, duration: clip.duration - local, offset: clip.offset + local }
  return updateTimeline({ ...project, clips: project.clips.filter(c => c.id !== clipId).concat(left, right) }, { type: 'move', clipId: right.id, start: right.start })
}
