import type { CliporaProject, TimelineClip } from './project-model'

export function clipAtTime(project: CliporaProject, time: number): TimelineClip | undefined {
  return [...project.clips].sort((a,b) => a.start - b.start).find(c => time >= c.start && time < c.start + c.duration)
}

export function nextClip(project: CliporaProject, clipId: string): TimelineClip | undefined {
  const clips = [...project.clips].sort((a,b) => a.start - b.start)
  const index = clips.findIndex(c => c.id === clipId)
  return index >= 0 ? clips[index + 1] : undefined
}

export function sourceTimeForClip(project: CliporaProject, clip: TimelineClip, timelineTime: number) {
  const asset = project.assets.find(a => a.id === clip.assetId)
  const local = Math.max(0, timelineTime - clip.start)
  return Math.min((asset?.duration ?? clip.duration), clip.offset + local)
}

export function timelineEnd(project: CliporaProject) {
  return project.clips.reduce((end,c) => Math.max(end,c.start+c.duration), 0)
}
