import { components, categories } from './components.js'

const idOf=(category,name)=>{
  const item=components[category].find(x=>x.name===name)
  if(!item) throw new Error(`PC recomendada usa un componente inexistente: ${category}/${name}`)
  return item.id
}
const pack=(id,title,tag,use,audience,names)=>({id,title,tag,use,audience,componentIds:Object.fromEntries(Object.entries(names).map(([key,name])=>[key,idOf(key,name)]))})

export const recommendedBuilds=[
  pack('office_ultra','Oficina / Estudio Ultra Rápida (Económica)','OFICINA · ECONÓMICA','Oficina / Estudio','Estudio, navegación intensiva, videollamadas y tareas cotidianas con buena respuesta.',{
    cpu:'Ryzen 5 5600',cooler:'AMD Wraith Stealth',motherboard:'MSI B550M PRO-VDH WIFI',ram:'Kingston Fury Beast 16GB (2x8) DDR4-3200',gpu:'Radeon RX 6600 8GB (PowerColor Fighter)',storage:'Kingston NV2 500GB',psu:'XPG Pylon 550W',case:'Montech Air 100 ARGB',
  }),
  pack('gamer_entry','Gamer Entrada 1080p Calidad-Precio','GAMING · 1080P','Gaming 1080p','Quien prioriza juegos actuales a 1080p y quiere una base económica para actualizar luego.',{
    cpu:'Ryzen 5 5600',cooler:'AMD Wraith Stealth',motherboard:'MSI B550M PRO-VDH WIFI',ram:'Kingston Fury Beast 16GB (2x8) DDR4-3200',gpu:'Radeon RX 6600 8GB (PowerColor Fighter)',storage:'Kingston NV3 1TB',psu:'Cooler Master MWE 650 Bronze V2',case:'Montech Air 100 ARGB',
  }),
  pack('gamer_competitive','Gamer Competitivo 1080p High-FPS','GAMING · HIGH-FPS','Gaming 1080p','Juegos competitivos con tasas altas de cuadros, CPU rápido y GPU para monitores de alta frecuencia.',{
    cpu:'Ryzen 7 9800X3D',cooler:'Thermalright Peerless Assassin 120 SE',motherboard:'MSI MAG B650 Tomahawk WiFi',ram:'G.Skill Flare X5 32GB (2x16) DDR5-6000 CL30',gpu:'GeForce RTX 5070 Ti 16GB (NVIDIA Founders Edition)',storage:'WD Black SN770 1TB',psu:'MSI MAG A750GL PCIE5',case:'Corsair 4000D Airflow',
  }),
  pack('gamer_1440_balanced','Gamer 1440p Ultra Equilibrado (La más recomendada)','RECOMENDADA · 1440P','Gaming 1440p','Gaming fluido en 1440p con una combinación equilibrada para calidad alta y buena vida útil.',{
    cpu:'Ryzen 7 7800X3D',cooler:'Thermalright Peerless Assassin 120',motherboard:'ASRock B650M Pro RS',ram:'G.Skill Flare X5 32GB (2x16) DDR5-6000 CL30',gpu:'GeForce RTX 4070 SUPER 12GB (NVIDIA Founders Edition)',storage:'WD Black SN850X 2TB',psu:'Corsair RM750e ATX 3.0',case:'Lian Li Lancool 216',
  }),
  pack('creator_4k','Creación de Contenido, Edición 4K e IA','CREACIÓN · PRODUCTIVIDAD','Edición / Renderizado','Edición de video, render, multitarea pesada y cargas de IA que aprovechan CPU, VRAM y memoria amplia.',{
    cpu:'Ryzen 9 9950X',cooler:'Arctic Liquid Freezer III 360',motherboard:'Gigabyte X870 AORUS Elite WiFi7',ram:'Corsair Vengeance 64GB (2x32) DDR5-6000',gpu:'GeForce RTX 5070 Ti 16GB (NVIDIA Founders Edition)',storage:'WD Black SN850X 4TB',psu:'be quiet! Pure Power 12 M 1000W',case:'Fractal Pop Air',
  }),
  pack('gamer_4k_enthusiast','Tope de Gama 4K Entusiasta','ENTUSIASTA · 4K','Gaming 4K','Gaming 4K con calidad máxima, trazado de rayos y margen para tareas exigentes en paralelo.',{
    cpu:'Ryzen 7 9800X3D',cooler:'Arctic Liquid Freezer III 360',motherboard:'MSI MAG B650 Tomahawk WiFi',ram:'Corsair Vengeance 64GB (2x32) DDR5-6000',gpu:'GeForce RTX 5080 16GB (NVIDIA Founders Edition)',storage:'Samsung 990 PRO 2TB',psu:'Corsair RM1000x SHIFT ATX 3.0',case:'NZXT H7 Flow (2024)',
  }),
]

export function resolveRecommendedBuild(recommendation){
  return Object.fromEntries(categories.map(([key])=>[key,components[key].find(item=>item.id===recommendation.componentIds[key])||null]))
}
