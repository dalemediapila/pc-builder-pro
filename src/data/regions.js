const nationalStores=[
  ['HardGamers',query=>`https://www.hardgamers.com.ar/search?text=${query}`],
  ['Compra Gamer',query=>`https://compragamer.com/productos?criterio=${query}`],
  ['Maximus Gaming',query=>`https://www.maximus.com.ar/Productos/maximus.aspx?busqueda=${query}`],
  ['FullH4rd',query=>`https://fullh4rd.com.ar/prod/search/${query}`],
  ['Mexx',query=>`https://www.mexx.com.ar/buscar/?p=${query}`],
  ['Libre Opción',query=>`https://www.libreopcion.com/productos?q=${query}`],
  ['Gezatek',query=>`https://www.gezatek.com.ar/tienda/?buscar=${query}`],
  ['Maldito Hard',query=>`https://www.malditohard.com.ar/buscar?q=${query}`],
  ['Logg Hardstore',query=>`https://www.logg.com.ar/productos?q=${query}`],
]

export const regions=[
  {id:'caba_gba',label:'CABA / GBA',shortLabel:'CABA / GBA',adjustmentPercent:0,localStores:[]},
  {id:'mendoza',label:'Mendoza',shortLabel:'Mendoza',adjustmentPercent:6,localStores:[
    ['Compufan Store (Mendoza)',query=>`https://www.compufanstore.com.ar/buscar?q=${query}`],
    ['Mendoza Gaming',query=>`https://mendozagaming.com.ar/?s=${query}&post_type=product`],
  ]},
  {id:'cordoba',label:'Córdoba',shortLabel:'Córdoba',adjustmentPercent:4,localStores:[
    ['Venex',query=>`https://www.venex.com.ar/resultado-busqueda.htm?keywords=${query}`],
    ['Gorilla Games',query=>`https://gorillagames.com.ar/?s=${query}&post_type=product`],
  ]},
  {id:'santa_fe',label:'Santa Fe',shortLabel:'Santa Fe',adjustmentPercent:4,localStores:[
    ['HardCore Computación',query=>`https://www.hardcorecomputacion.com.ar/?s=${query}&post_type=product`],
  ]},
  {id:'tucuman_noa',label:'Tucumán / NOA',shortLabel:'Tucumán / NOA',adjustmentPercent:8,localStores:[]},
  {id:'neuquen_patagonia',label:'Neuquén / Patagonia',shortLabel:'Neuquén / Patagonia',adjustmentPercent:10,localStores:[]},
  {id:'resto_pais',label:'Resto del país',shortLabel:'Resto del país',adjustmentPercent:6,localStores:[]},
]

export const nationalStoreSearches=(name,regionId)=>{
  if(!name)return []
  const region=regions.find(item=>item.id===regionId)||regions[0]
  const query=encodeURIComponent(name)
  const local=region.localStores.map(([store,makeUrl])=>({store,url:makeUrl(query),local:true}))
  const national=nationalStores.map(([store,makeUrl])=>({store,url:makeUrl(query),local:false}))
  return [...local,...national]
}
