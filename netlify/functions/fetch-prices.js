import { regions, nationalStores, searchStoreUrl } from '../../src/data/regions.js'

const STORE_TIMEOUT_MS = 4_000
const ACCESSORY_OR_USED = /\b(pc armada|pc gamer|computadora armada|desktop pc|notebook|combo|soporte|riser|cable|caja|usado|usada|outlet|reacondicionado|refurbished|adaptador|adapter|repuesto|replacement|bundle|enclosure|carcasa|funda|waterblock|cooler kit|fan kit|pasta termica|thermal paste)\b/i
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function parseArs(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : null
  const cleaned = String(value || '').replace(/[^\d.,]/g, '')
  if (!cleaned) return null
  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, '')
  const amount = Number(normalized)
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

const unescapeHtml = value => value.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
const plainText = value => unescapeHtml(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim()

function isInstallmentAmount(text, index, length) {
  const before = plainText(text.slice(Math.max(0, index - 70), index)).toLowerCase()
  return /(cuotas?\s*(?:de|:)?|ahora\s*12|env[ií]o\s*:?)\s*$/.test(before)
    || /(?:^|\s)x\s*(?:\d+\s*)?$/.test(before)
}

function priceCandidates(block) {
  const candidates = []
  const push = (raw, index = 0, sourceLength = 0, contextual = block) => {
    if (!raw || isInstallmentAmount(contextual, index, sourceLength)) return
    const price = parseArs(raw)
    if (price) candidates.push(price)
  }
  for (const match of block.matchAll(/itemprop=["']price["'][^>]*content=["']([^"']+)["']/gi)) push(match[1], match.index, match[0].length)
  for (const match of block.matchAll(/(?:data-price|data-product-price)=["']([^"']+)["']/gi)) push(match[1], match.index, match[0].length)
  for (const match of block.matchAll(/\$\s*[\d.,]+/g)) push(match[0], match.index, match[0].length)
  return candidates
}

function matchesModel(title, searchQuery) {
  if (!title || ACCESSORY_OR_USED.test(title)) return false
  const query = normalize(searchQuery).trim()
  const product = normalize(title)
  const tokens = query.split(/[^a-z0-9]+/).filter(Boolean)
  if (!tokens.length) return false
  const hasToken = token => {
    if (new RegExp(`(^|[^a-z0-9])${escapeRegExp(token)}([^a-z0-9]|$)`).test(product)) return true
    if (token === 'rtx') return /(^|[^a-z0-9])rtx\s*\d/.test(product)
    if (token === 'rx') return /(^|[^a-z0-9])rx\s*\d/.test(product)
    if (/^\d{4}$/.test(token) && tokens.some(value => value === 'rtx' || value === 'rx') && new RegExp(`(^|[^a-z0-9])(?:rtx|rx)\\s*${token}(?![a-z0-9])`).test(product)) return true
    if (/^\d{4}$/.test(token) && new RegExp(`(^|[^a-z0-9])${token}\\s*mhz\\b`).test(product)) return true
    return false
  }
  if (!tokens.every(hasToken)) return false
  const exactSuffixes = ['ti', 'super', 'xtx', 'xt', 'gre', 'x3d', 'kf', 'ks', 'ge', 'gt']
  for (const suffix of exactSuffixes) {
    if (hasToken(suffix) && !tokens.includes(suffix)) return false
  }
  return true
}

function productBlocks(html) {
  const blocks = []
  const starts = /<(li|article|div)\b([^>]*(?:product|item|result)[^>]*)>/gi
  for (const start of html.matchAll(starts)) {
    const tag = start[1]
    const boundary = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi')
    boundary.lastIndex = start.index + start[0].length
    let depth = 1
    let end = null
    let token
    while ((token = boundary.exec(html))) {
      if (token[0].startsWith('</')) depth -= 1
      else if (!/\/\s*>$/.test(token[0])) depth += 1
      if (depth === 0) { end = boundary.lastIndex; break }
    }
    if (end !== null) blocks.push(html.slice(start.index, end))
  }
  return blocks
}

function productsFromHtml(html, baseUrl) {
  const products = []
  const jsonScripts = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  for (const script of jsonScripts) {
    try {
      const parsed = JSON.parse(script[1])
      const flat = Array.isArray(parsed) ? parsed : [parsed]
      for (const record of flat) {
        const nodes = [record, ...(record?.['@graph'] || [])]
        for (const node of nodes) {
          const title = node?.name
          const offer = Array.isArray(node?.offers) ? node.offers[0] : node?.offers
          const raw = offer?.price ?? offer?.lowPrice ?? node?.price ?? node?.regular_price ?? node?.prices?.price
          const minorUnit = Number(node?.prices?.currency_minor_unit) || 0
          const parsedPrice = parseArs(raw)
          const price = parsedPrice === null ? null : parsedPrice / (node?.prices?.price !== undefined ? 10 ** minorUnit : 1)
          const stock = node?.is_in_stock !== false && !/outofstock|soldout/i.test(String(offer?.availability || node?.availability || node?.stock_status || ''))
          if (title && price && stock) products.push({ title: plainText(title), price, stock, url: offer?.url || node?.url || baseUrl })
        }
      }
    } catch { /* malformed store metadata is ignored; visible product cards are still parsed */ }
  }
  for (const block of productBlocks(html)) {
    const titleMarkup = block.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1]
      || block.match(/<(?:a|span|div)[^>]*class=["'][^"']*(?:product-title|product_name|product-name|product__title|title)[^"']*["'][^>]*>([\s\S]*?)<\//i)?.[1]
      || block.match(/itemprop=["']name["'][^>]*>([^<]+)/i)?.[1]
    const title = titleMarkup ? plainText(titleMarkup) : ''
    if (!title || /agotado|sin stock|out of stock|no disponible/i.test(plainText(block))) continue
    const prices = priceCandidates(block)
    const href = block.match(/<a[^>]+href=["']([^"']+)/i)?.[1]
    const price = prices.length ? Math.min(...prices) : null
    if (price) products.push({ title, price, stock: true, url: href ? new URL(href, baseUrl).href : baseUrl })
  }
  return products
}

async function requestStore(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'PCBuilderProPriceBot/2.0 (public product price lookup)', accept: 'text/html,application/json' },
    signal: AbortSignal.timeout(STORE_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`Tienda respondió ${response.status}`)
  const body = await response.text()
  if ((response.headers.get('content-type') || '').includes('json')) {
    try { return productsFromHtml(`<script type="application/ld+json">${body}</script>`, url) } catch { return [] }
  }
  return productsFromHtml(body, url)
}

async function findStoreOffer(store, searchQuery) {
  const url = searchStoreUrl(store, searchQuery)
  try {
    const products = await requestStore(url)
    const matching = products.filter(item => item.stock && item.price > 0 && matchesModel(item.title, searchQuery))
      .sort((a, b) => a.price - b.price)
    const cheapest = matching[0]
    return cheapest ? { storeName: store.name, productTitle: cheapest.title, priceArs: cheapest.price, url: cheapest.url || url } : null
  } catch { return null }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  if (!sorted.length) return null
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

function filterMedianOutliers(offers, tolerance = 0.30) {
  const center = median(offers.map(item => item.priceArs))
  if (center === null) return { medianArs: null, accepted: [] }
  const accepted = offers.filter(item => item.priceArs >= center * (1 - tolerance) && item.priceArs <= center * (1 + tolerance))
  return { medianArs: median(accepted.map(item => item.priceArs)), accepted }
}

async function hardGamersResults(store, searchQuery) {
  const url = searchStoreUrl(store, searchQuery)
  try {
    const products = await requestStore(url)
    const seen = new Set()
    const offers = products.filter(item => item.stock && item.price > 0 && matchesModel(item.title, searchQuery))
      .filter(item => { const key = `${normalize(item.title)}|${item.url || ''}|${item.price}`; if (seen.has(key)) return false; seen.add(key); return true })
      .slice(0, 12)
      .map((item, index) => ({ storeName: `HardGamers · resultado ${index + 1}`, productTitle: item.title, priceArs: item.price, url: item.url || url }))
    const filtered = filterMedianOutliers(offers, 0.30)
    return filtered.medianArs === null ? null : { medianArs: filtered.medianArs, offers: filtered.accepted }
  } catch { return null }
}

function responseBody(payload) {
  return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(payload) }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const { provinceId, searchKey, componentId, category } = JSON.parse(event.body || '{}')
    if (!provinceId || !searchKey) return { statusCode: 400, body: JSON.stringify({ error: 'provinceId y searchKey son obligatorios' }) }
    const region = regions.find(item => item.id === provinceId) || regions[0]
    const nationalHardGamers = nationalStores.find(store => store.name === 'HardGamers')
    const compraGamer = nationalStores.find(store => store.name === 'Compra Gamer')
    const isCaba = region.id === 'caba_gba'
    const localOffers = isCaba ? [] : (await Promise.all(region.localStores.map(store => findStoreOffer(store, searchKey)))).filter(Boolean)

    if (!isCaba && localOffers.length > 0) {
      const local = filterMedianOutliers(localOffers, 0.30)
      if (local.medianArs !== null) return responseBody({ componentId, category, provinceId: region.id, province: region.label, averagePriceArs: local.medianArs, storeBreakdown: local.accepted, sourceType: 'local_average', priceMethod: 'median', updatedAt: new Date().toISOString() })
    }

    const [hardGamers, compraOffer] = await Promise.all([
      hardGamersResults(nationalHardGamers, searchKey),
      findStoreOffer(compraGamer, searchKey),
    ])
    const nationalSources = [
      ...(hardGamers ? [{ storeName: 'HardGamers (mediana)', productTitle: `${hardGamers.offers.length} resultados válidos; mediana nacional`, priceArs: hardGamers.medianArs, url: searchStoreUrl(nationalHardGamers, searchKey), offers: hardGamers.offers }] : []),
      ...(compraOffer ? [compraOffer] : []),
    ]
    const national = filterMedianOutliers(nationalSources, 0.30)
    const acceptedNames = new Set(national.accepted.map(offer => offer.storeName))
    const breakdown = national.accepted.flatMap(offer => offer.offers || [offer]).map(({ storeName, productTitle, priceArs, url }) => ({ storeName, productTitle, priceArs, url }))
    const sourceType = national.medianArs === null ? 'estimated_fallback' : 'national_average'
    return responseBody({ componentId, category, provinceId: region.id, province: region.label, averagePriceArs: national.medianArs, storeBreakdown: breakdown, sourceType, priceMethod: 'median', deliveryNote: isCaba ? 'Envío $0 estimado' : `Envío a ${region.label}`, nationalSources: [...acceptedNames], updatedAt: new Date().toISOString() })
  } catch (error) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: error?.message || 'Price sync failed' }) }
  }
}
