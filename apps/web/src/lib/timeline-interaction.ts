export type TimelineGeometry = { scale: number; scrollLeft: number; laneLeft: number }

export function timelineXToTime(clientX: number, geometry: TimelineGeometry) {
  return Math.max(0, (clientX - geometry.laneLeft + geometry.scrollLeft) / geometry.scale)
}

export function clampTrimStart(start: number, proposed: number, maxDuration: number) {
  const next = Math.max(0, Math.min(proposed, start + maxDuration - 0.05))
  return next
}

export function clampTrimEnd(start: number, proposedEnd: number, maxDuration: number) {
  const end = Math.max(start + 0.05, Math.min(proposedEnd, start + maxDuration))
  return end
}

export function snapTime(time: number, candidates: number[], threshold = 0.18) {
  const nearest = candidates.reduce<{ value: number; distance: number } | null>((best, value) => {
    const distance = Math.abs(value - time)
    return !best || distance < best.distance ? { value, distance } : best
  }, null)
  return nearest && nearest.distance <= threshold ? nearest.value : time
}
