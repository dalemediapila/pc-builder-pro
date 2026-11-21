const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const cacheKey = (provinceId, componentId) => `pcbp-live-price:${provinceId}:${componentId}`
const inFlight = new Map()

export function readCachedComponentPrice(provinceId, componentId) {
  try {
    const saved = JSON.parse(localStorage.getItem(cacheKey(provinceId, componentId)) || 'null')
    if (!saved || Date.now() - saved.cachedAt >= CACHE_TTL_MS) return null
    return saved.result || null
  } catch { return null }
}

export async function syncComponentPrices({ componentId, searchKey, basePriceArs, category, provinceId }) {
  const cached = readCachedComponentPrice(provinceId, componentId)
  if (cached) return cached
  const key = cacheKey(provinceId, componentId)
  if (inFlight.has(key)) return inFlight.get(key)
  const request = (async () => {
    const response = await fetch('/.netlify/functions/fetch-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ componentId, searchKey, basePriceArs, category, provinceId }),
      cache: 'no-store',
    })
    if (!response.ok) throw new Error(`Price sync failed (${response.status})`)
    const result = await response.json()
    if (Array.isArray(result?.storeBreakdown)) {
      try { localStorage.setItem(key, JSON.stringify({ cachedAt: Date.now(), result })) } catch { /* storage can be full or disabled */ }
    }
    return result
  })()
  inFlight.set(key, request)
  try {
    return await request
  } finally {
    inFlight.delete(key)
  }
}
