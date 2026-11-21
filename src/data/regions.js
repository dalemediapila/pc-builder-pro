const store=(name,search,kind='html',local=true)=>({name,search,kind,local})
const queryFor=name=>encodeURIComponent(name)

const mendozaStores=[
  store('Mendohard',name=>`https://mendohard.com.ar/?s=${queryFor(name)}&post_type=product`,'woocommerce'),
  store('TiendaOP',name=>`https://tiendaop.com.ar/product-grid?search=${queryFor(name)}`),
  store('Cedeeco',name=>`https://cedeeco.mitiendanube.com/search/?q=${queryFor(name)}`,'html'),
  store('AyP Computación',name=>`https://aypcomputacion.com/?s=${queryFor(name)}&post_type=product`,'woocommerce'),
  store('Gaming City',name=>`https://www.gamingcity.com.ar/listado/${queryFor(name)}`,'html'),
]

const cabaStores=[
  store('Compra Gamer',name=>`https://compragamer.com/productos?criterio=${queryFor(name)}`),
  store('Maximus Gaming',name=>`https://www.maximus.com.ar/Productos/maximus.aspx?busqueda=${queryFor(name)}`),
  store('FullH4rd',name=>`https://fullh4rd.com.ar/prod/search/${queryFor(name)}`),
  store('Mexx',name=>`https://www.mexx.com.ar/buscar/?p=${queryFor(name)}`),
  store('Libre Opción',name=>`https://www.libreopcion.com/productos?q=${queryFor(name)}`),
  store('Logg Hardstore',name=>`https://www.logg.com.ar/productos?q=${queryFor(name)}`),
  store('Gezatek',name=>`https://www.gezatek.com.ar/tienda/?buscar=${queryFor(name)}`),
  store('Maldito Hard',name=>`https://www.malditohard.com.ar/buscar?q=${queryFor(name)}`),
]

const fallbackStores=[
  cabaStores[0],
  store('Gaming City',name=>`https://www.gamingcity.com.ar/listado/${queryFor(name)}`),
  cabaStores[4],
  store('Venex',name=>`https://www.venex.com.ar/resultado-busqueda.htm?keywords=${queryFor(name)}`),
  cabaStores[1],
]

export const nationalStores=[
  cabaStores[0],
  store('HardGamers',name=>`https://www.hardgamers.com.ar/search?text=${queryFor(name)}`),
  cabaStores[1],
  cabaStores[4],
]

export const regions=[
  {id:'caba_gba',label:'CABA / Buenos Aires',shortLabel:'CABA / Buenos Aires',adjustmentPercent:0,localStores:cabaStores,fallbackStores:[],usesShippingFallback:false},
  {id:'mendoza',label:'Mendoza',shortLabel:'Mendoza',adjustmentPercent:6,localStores:mendozaStores,fallbackStores:[],usesShippingFallback:false},
  {id:'cordoba',label:'Córdoba',shortLabel:'Córdoba',adjustmentPercent:4,localStores:[
    store('Venex',name=>`https://www.venex.com.ar/resultado-busqueda.htm?keywords=${queryFor(name)}`),
    store('Gorila Games',name=>`https://gorilagames.com/Listado?buscar=${queryFor(name)}`),
  ],fallbackStores:[],usesShippingFallback:false},
  {id:'santa_fe',label:'Santa Fe',shortLabel:'Santa Fe',adjustmentPercent:4,localStores:[
    store('HardCore Computación',name=>`https://www.hardcorecomputacion.com.ar/?s=${queryFor(name)}&post_type=product`,'woocommerce'),
    store('Star Computación',name=>`https://www.starcomputacion.com.ar/advanced_search_result.php?keywords=${queryFor(name)}`),
  ],fallbackStores:[],usesShippingFallback:false},
  {id:'tucuman_noa',label:'Tucumán / NOA',shortLabel:'Tucumán / NOA',adjustmentPercent:8,localStores:[],fallbackStores,usesShippingFallback:true},
  {id:'neuquen_patagonia',label:'Neuquén / Patagonia',shortLabel:'Neuquén / Patagonia',adjustmentPercent:10,localStores:[],fallbackStores,usesShippingFallback:true},
  {id:'resto_pais',label:'Resto del país',shortLabel:'Resto del país',adjustmentPercent:6,localStores:[],fallbackStores,usesShippingFallback:true},
]

export const getRegionStores=regionId=>{
  const region=regions.find(item=>item.id===regionId)||regions[0]
  const useFallback=region.localStores.length<2
  return {region,stores:useFallback?region.fallbackStores:region.localStores,usesShippingFallback:useFallback}
}

export const nationalStoreSearches=(name,regionId)=>{
  if(!name)return []
  const {stores,usesShippingFallback}=getRegionStores(regionId)
  return stores.map(item=>({store:item.name,url:item.search(name),local:item.local&&!usesShippingFallback,shipping:usesShippingFallback,kind:item.kind}))
}

export const searchStoreUrl=(store,name)=>store.search(name)
