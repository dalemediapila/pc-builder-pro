const PRICE_RANGES_USD = {
  cpu: [50, 1600], cooler: [0, 500], motherboard: [45, 1000], ram: [25, 700],
  gpu: [120, 2500], storage: [15, 700], psu: [25, 500], case: [30, 800],
}

const LIMITED_PATTERNS = [
  /5800x3d/i, /12100f/i, /12400f/i, /6600 8gb/i, /3060 12gb/i,
  /4070 super/i, /4070 ti super/i, /7900 gre/i,
]

const median = values => {
  const sorted=values.filter(Number.isFinite).sort((a,b)=>a-b)
  if(!sorted.length)return null
  const middle=Math.floor(sorted.length/2)
  return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2
}

const priceValue = item => typeof item==='number'?item:Number(item?.priceArs??item?.price??item?.value)

export function filterPriceOutliers(prices){
  const valid=(prices||[]).filter(item=>Number.isFinite(priceValue(item))&&priceValue(item)>0)
  const center=median(valid.map(priceValue))
  if(center===null)return {median:null,accepted:[],rejected:[]}
  const accepted=[],rejected=[]
  for(const item of valid){const value=priceValue(item);(value>=center*.65&&value<=center*1.35?accepted:rejected).push(item)}
  return {median:center,accepted,rejected}
}

// HardGamers exposes search results to users through its website; when a result
// set is supplied by a permitted integration, run it through this same filter.
export const filterHardGamersPrices=filterPriceOutliers

export function getPriceWarning(category,item,currentArs,arsPerUsd){
  if(!item)return false
  const baseUsd=Number(item.price)
  const enteredUsd=Number(currentArs)/Number(arsPerUsd)
  const [min,max]=PRICE_RANGES_USD[category]||[0,Infinity]
  const outsideCategory=!Number.isFinite(baseUsd)||baseUsd<min||baseUsd>max
  const editedOutlier=Number.isFinite(enteredUsd)&&baseUsd>0&&(enteredUsd<baseUsd*.65||enteredUsd>baseUsd*1.35)
  const limited=LIMITED_PATTERNS.some(pattern=>pattern.test(item.name||''))
  return outsideCategory||editedOutlier||limited
}

export function auditCatalogPrices(components){
  return Object.entries(components).flatMap(([category,items])=>items.filter(item=>{
    if(category==='cooler'&&item.stock)return false
    const [min,max]=PRICE_RANGES_USD[category]||[0,Infinity]
    return !Number.isFinite(item.price)||item.price<min||item.price>max
  }).map(item=>({category,name:item.name,price:item.price})))
}
