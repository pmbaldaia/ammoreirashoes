export function applyImageFallback(
  event: Event,
  fallback?: string,
  element?: HTMLImageElement | null,
) {
  const image =
    (event.target instanceof HTMLImageElement ? event.target : null) ??
    (element instanceof HTMLImageElement ? element : null)

  if (!image?.dataset) return false

  const nextSrc = fallback || image.dataset.fallback
  if (!nextSrc || image.dataset.fallbackApplied === '1') return false

  const current = image.currentSrc || image.src || ''
  if (current.includes(nextSrc)) return false

  image.dataset.fallbackApplied = '1'
  image.src = nextSrc
  return true
}
