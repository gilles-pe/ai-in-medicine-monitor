/** Resolve a touch-sized source target in CSS pixels, independent of SVG scale. */
export function nearbyEvidenceIds(points, x, y, radius = 22) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
  return [...new Set(points.map(point => ({...point, distance: Math.hypot(point.x - x, point.y - y)}))
    .filter(point => point.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
    .flatMap(point => point.ids))];
}
