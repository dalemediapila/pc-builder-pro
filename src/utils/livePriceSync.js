const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const CACHE_VERSION = 'v4_real_market'
const cacheKey = (provinceId, componentId) => `pcbp-live-price:${CACHE_VERSION}:${provinceId}:${componentId}`
const inFlight = new Map()

export function cleanPriceSearchQuery(category, name) {
  const value = String(name || '').replace(/_/g, ' ')
  if (category === 'cpu') return value.match(/Core\s+Ultra\s+[3579]\s+\d{3,4}[A-Z0-9]*|Core\s+i[3579]-?\d{4,5}[A-Z]?|Ryzen\s+[3579]\s+\d{4}[A-Z0-9]*/i)?.[0] || value
  if (category === 'gpu') return value.match(/RTX\s*\d{4}(?:\s*(?:Ti\s*Super|Ti|Super))?|RX\s*\d{4}(?:\s*(?:XTX|XT|GRE))?|Arc\s+B\d{3}/i)?.[0] || value
  if (category === 'motherboard') return value.match(/\b(?:B|A|X|H|Z)\d{3,4}M?\b/i)?.[0] || value
  if (category === 'ram') {
    const capacity = value.match(/\b\d+GB\b/i)?.[0]
    const type = value.match(/\bDDR[45]\b/i)?.[0]
    const speed = value.match(/\b\d{4}\b/i)?.[0]
    return [capacity, type, speed].filter(Boolean).join(' ') || value
  }
  if (category === 'storage') {
    const model = value.match(/\b(?:NV[23]|SN\d{3,4}X?|980|990\s*PRO)\b/i)?.[0]
    const capacity = value.match(/\b\d+\s?(?:TB|GB)\b/i)?.[0]
    return [model, capacity].filter(Boolean).join(' ') || `NVMe ${capacity || ''}`.trim()
  }
  return value.trim()
}

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
    if (result?.sourceType !== 'estimated_fallback' && Array.isArray(result?.storeBreakdown) && result.storeBreakdown.length > 0) {
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
