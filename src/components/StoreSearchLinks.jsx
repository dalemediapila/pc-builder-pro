import { ExternalLink } from 'lucide-react'
import { nationalStoreSearches } from '../data/regions.js'

export const storeSearches=(name,regionId='caba_gba')=>nationalStoreSearches(name,regionId).map(({store,url,local})=>[store,url,local])

export default function StoreSearchLinks({name,regionId='caba_gba',compact=false}){
  const links=storeSearches(name,regionId)
  if(!links.length)return null
  return <div className={`store-search-links ${compact?'compact':''}`} aria-label={`Buscar ${name} en tiendas`}><span>Buscar precio en:</span>{links.map(([store,url,local])=><a key={store} className={local?'local-store-link':''} href={url} target="_blank" rel="noopener noreferrer" title={`Buscar ${name} en ${store}`}><span>{store}</span>{local&&<small>Local en tu provincia</small>}<ExternalLink size={10}/></a>)}</div>
}
