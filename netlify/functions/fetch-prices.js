import { regions, nationalStores, searchStoreUrl } from '../../src/data/regions.js'

const TIMEOUT_MS = 4_000
const ACCESSORY = /\b(cable|adaptador|adapter|soporte|bracket|repuesto|replacement|combo|bundle|kit upgrade|pc armada|gabinete completo|motherboard bundle|disipador para|pasta termica|thermal paste|enclosure|carcasa|funda|waterblock|cooler kit|fan kit)\b/i
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function parseArs(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : null
  const cleaned = String(value || '').replace(/[^\d.,]/g, '')
  if (!cleaned) return null
  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, '')
  const amount = Number(normalized)
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

function matchesModel(title, searchKey) {
  if (!title || ACCESSORY.test(title)) return false
  const key = normalize(searchKey)
  const titleNorm = normalize(title)
  const ids = key.match(/[a-z]*\d+[a-z0-9]*/g) || []
  const distinctive = ids.sort((a, b) => b.length - a.length)[0]
  if (distinctive) {
    const qualifiers = key.match(/\b(?:ti|super|xtx|xt|gre|x3d|kf|ks|aio)\b/g) || []
    return titleNorm.includes(distinctive) && qualifiers.every(token => titleNorm.split(/\W+/).includes(token))
  }
  return key.split(/\s+/).filter(word => word.length > 2).every(word => titleNorm.includes(word))
}

function productsFromJson(value) {
  if (!value || typeof value !== 'object') return []
  if (Array.isArray(value)) return value.flatMap(productsFromJson)
  const title = value.name || value.title || value.product_name
  const offers = value.offers || value
  const rawPrice = offers.price ?? offers.lowPrice ?? value.price ?? value.regular_price ?? value.prices?.price
  const minorUnit = Number(value.prices?.currency_minor_unit) || 0
  const price = parseArs(rawPrice) / (value.prices?.price !== undefined ? 10 ** minorUnit : 1)
  const availability = offers.availability || value.availability
  const stock = value.is_in_stock !== false && !/outofstock|soldout/i.test(String(availability || value.stock_status || ''))
  const self = title && price ? [{ title, price: parseArs(price), stock, url: value.url || value.permalink || value.link }] : []
  return [...self, ...Object.values(value).flatMap(child => child === offers ? [] : productsFromJson(child))]
}

function productsFromHtml(html, baseUrl) {
  const found = []
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { found.push(...productsFromJson(JSON.parse(match[1]))) } catch { /* tolerate malformed store JSON-LD */ }
  }
  const blocks = html.match(/<(?:li|article|div)[^>]*(?:product|item|result)[^>]*>[\s\S]*?<\/(?:li|article|div)>/gi) || []
  for (const block of blocks) {
    const title = block.match(/<(?:h[1-6]|a)[^>]*(?:class=["'][^"']*(?:product|title|name)[^"']*["'])?[^>]*>([\s\S]*?)<\//i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').trim()
      || block.match(/(?:itemprop=["']name["'][^>]*>)([^<]+)/i)?.[1]?.trim()
    if (!title || /agotado|sin stock|out of stock|no disponible/i.test(block)) continue
    const priceText = block.match(/(?:itemprop=["']price["'][^>]*content=["']([^"']+)|data-price=["']([^"']+)|\$\s*([\d.,]+))/i)
    const price = parseArs(priceText?.[1] || priceText?.[2] || priceText?.[3])
    const href = block.match(/<a[^>]+href=["']([^"']+)/i)?.[1]
    if (price) found.push({ title, price, stock: true, url: href ? new URL(href, baseUrl).href : baseUrl })
  }
  return found
}

async function request(url, signal) {
  const response = await fetch(url, { headers: { 'user-agent': 'PCBuilderProPriceBot/1.0 (+public catalog quote)', accept: 'text/html,application/json' }, signal })
  if (!response.ok) throw new Error(`Store returned ${response.status}`)
  const body = await response.text()
  const type = response.headers.get('content-type') || ''
  if (type.includes('json')) {
    try { return productsFromJson(JSON.parse(body)) } catch { return [] }
  }
  return productsFromHtml(body, url)
}

async function offersForStore(store, searchKey, basePriceArs) {
  try {
    const searchUrl = searchStoreUrl(store, searchKey)
    const signal = AbortSignal.timeout(TIMEOUT_MS)
    let products = []
    if (store.kind === 'woocommerce') {
      const apiUrl = new URL('/wp-json/wc/store/v1/products', new URL(searchUrl).origin)
      apiUrl.searchParams.set('search', searchKey)
      apiUrl.searchParams.set('per_page', '30')
      try { products = await request(apiUrl.href, signal) } catch { products = await request(searchUrl, signal) }
    } else products = await request(searchUrl, signal)
    const candidates = products.filter(item => item.stock && item.price && matchesModel(item.title, searchKey))
      .filter(item => item.price >= basePriceArs * 0.65 && item.price <= basePriceArs * 1.45)
      .sort((a, b) => a.price - b.price)
    const best = candidates[0]
    return best ? { storeName: store.name, priceArs: best.price, url: best.url || searchUrl, isLocal: store.local !== false } : null
  } catch { return null }
}

function median(values) {
  const ordered = [...values].sort((a, b) => a - b)
  if (!ordered.length) return null
  const mid = Math.floor(ordered.length / 2)
  return ordered.length % 2 ? ordered[mid] : (ordered[mid - 1] + ordered[mid]) / 2
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const { provinceId, searchKey, basePriceArs, componentId, category } = JSON.parse(event.body || '{}')
    const base = Number(basePriceArs)
    if (!provinceId || !searchKey || !Number.isFinite(base) || base <= 0) return { statusCode: 400, body: JSON.stringify({ error: 'provinceId, searchKey y basePriceArs son obligatorios' }) }
    const region = regions.find(item => item.id === provinceId) || regions[0]
    const localStores = region.localStores
    const localOffers = (await Promise.all(localStores.map(store => offersForStore(store, searchKey, base)))).filter(Boolean)
    let nationalOffers = []
    if (localOffers.length < 2) {
      nationalOffers = (await Promise.all(nationalStores.map(store => offersForStore({ ...store, local: false }, searchKey, base)))).filter(Boolean)
    }
    const uniqueStores = new Map()
    for (const offer of [...localOffers, ...nationalOffers]) if (!uniqueStores.has(offer.storeName)) uniqueStores.set(offer.storeName, offer)
    const candidates = [...uniqueStores.values()]
    const center = median(candidates.map(offer => offer.priceArs))
    const accepted = center === null ? [] : candidates.filter(offer => offer.priceArs >= center * 0.65 && offer.priceArs <= center * 1.35)
    const averagePriceArs = accepted.length ? accepted.reduce((sum, offer) => sum + offer.priceArs, 0) / accepted.length : null
    const hasNational = accepted.some(offer => !offer.isLocal)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ componentId, category, provinceId: region.id, province: region.label, averagePriceArs, storeBreakdown: accepted.map(({ storeName, priceArs, url }) => ({ storeName, priceArs, url })), sourceType: hasNational ? 'national_average' : 'local_average', updatedAt: new Date().toISOString() }),
    }
  } catch (error) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error?.message || 'Price sync failed' }) }
  }
}
