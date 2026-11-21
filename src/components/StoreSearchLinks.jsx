import { ExternalLink } from 'lucide-react'
import { getRegionStores, nationalStoreSearches } from '../data/regions.js'

export const storeSearches=(name,regionId='caba_gba')=>nationalStoreSearches(name,regionId).map(({store,url,local,shipping})=>[store,url,local,shipping])

export default function StoreSearchLinks({name,regionId='caba_gba',compact=false}){
  const links=storeSearches(name,regionId)
  const {region,usesShippingFallback}=getRegionStores(regionId)
  if(!links.length)return null
  return <div className={`store-search-links ${compact?'compact':''}`} aria-label={`Buscar ${name} en tiendas virtuales`}><span>{usesShippingFallback?`Tiendas virtuales con envío a ${region.label}:`:'Buscar precio en tiendas virtuales:'}</span>{links.map(([store,url,local,shipping])=><a key={store} className={`${local?'local-store-link':''} ${shipping?'shipping-store-link':''}`} href={url} target="_blank" rel="noopener noreferrer" title={`Buscar ${name} en ${store}`}><span>{store}</span>{local&&<small>Local en tu provincia</small>}{shipping&&<small>Envío nacional</small>}<ExternalLink size={10}/></a>)}</div>
}
