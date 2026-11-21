// Precios base calibrados contra referencias minoristas de Mendoza; la app convierte
// a ARS con la cotización elegida y conserva los importes locales editados por usuario.
export const REFERENCE_ARS_PER_USD = 1675
const price = (usd) => {
  const priceArs=Math.round(usd*REFERENCE_ARS_PER_USD)
  return {price:Number((priceArs/REFERENCE_ARS_PER_USD).toFixed(2)),priceArs}
}
const streetPrice = ars => ({price:Number((ars/REFERENCE_ARS_PER_USD).toFixed(2)),priceArs:Math.round(ars)})
const idFor = name => name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')

export const components = {
  cpu: [
    ['Ryzen 5 5500','AMD','AM4',65,47,true,85],['Ryzen 5 5600','AMD','AM4',65,55,true,115],['Ryzen 7 5800X3D','AMD','AM4',105,83,false,285],
    ['Core i3-12100F','Intel','LGA1700',58,48,true,95],['Core i5-12400F','Intel','LGA1700',65,58,true,135],['Core i5-13400F','Intel','LGA1700',65,68,true,185],['Core i5-14400F','Intel','LGA1700',65,71,true,205],
    ['Ryzen 5 7600','AMD','AM5',65,70,true,195],['Ryzen 5 8600G','AMD','AM5',65,66,true,185],['Core Ultra 5 245K','Intel','LGA1851',125,75,false,270],['Ryzen 7 7800X3D','AMD','AM5',120,92,false,365],
    ['Ryzen 7 9800X3D','AMD','AM5',120,100,false,480],['Ryzen 9 9950X','AMD','AM5',170,99,false,620],['Core i7-14700K','Intel','LGA1700',125,94,false,395],['Core Ultra 7 265K','Intel','LGA1851',125,91,false,385],['Core Ultra 9 285K','Intel','LGA1851',125,97,false,580],
  ].map(([name,brand,socket,tdp,score,hasStockCooler,usd])=>{
    const streetUsd={ 'Ryzen 5 5500':105,'Ryzen 5 5600':135,'Core i3-12100F':115,'Core i5-12400F':145,'Ryzen 5 7600':225,'Core i5-14400F':235 }
    const corrected=streetUsd[name]??usd
    const generation=name==='Ryzen 7 5800X3D'?'Ryzen 5000X3D':name.startsWith('Ryzen 5 5')?'Ryzen 5000':name==='Ryzen 5 7600'?'Ryzen 7000':name==='Ryzen 5 8600G'?'Ryzen 8000G':name.startsWith('Ryzen 7 98')?'Ryzen 9000X3D':name==='Ryzen 9 9950X'?'Ryzen 9000':name==='Core Ultra 5 245K'||name.startsWith('Core Ultra 7')||name.startsWith('Core Ultra 9')?'Intel Core Ultra 200S':name.includes('12100')||name.includes('12400')?'Intel 12th':name.includes('13400')?'Intel 13th':name.includes('14400')||name.includes('14700')?'Intel 14th':'Intel 12th'
    const stockCoolerName=hasStockCooler?(brand==='AMD'?'AMD Wraith Stealth':'Intel Laminar RM1'):null
    return {id:idFor(name),name,brand,socket,tdp,score,stockCooler:Boolean(stockCoolerName),stockCoolerName,generation,...price(corrected)}
  }),
  cooler: [
    ['AMD Wraith Stealth','Aire',54,65,0],['Intel Laminar RM1','Aire',47,65,0],['ID-Cooling SE-214-XT','Aire',150,180,22],['DeepCool AK400','Aire',155,220,32],['Cooler Master Hyper 212 Halo','Aire',154,180,42],
    ['Thermalright Peerless Assassin 120 SE','Aire',157,260,38],['Thermalright Peerless Assassin 120','Aire',157,260,43],['DeepCool AK620','Aire',160,260,65],['Noctua NH-U12S redux','Aire',158,180,55],['be quiet! Pure Rock 2','Aire',155,150,45],
    ['Arctic Liquid Freezer III 240','AIO 240mm',240,300,90],['Corsair iCUE H100i Elite Capellix XT','AIO 240mm',240,250,140],['NZXT Kraken 240','AIO 240mm',240,250,140],['Arctic Liquid Freezer III 360','AIO 360mm',360,350,120],
    ['Corsair iCUE H150i Elite Capellix XT','AIO 360mm',360,300,180],['NZXT Kraken 360','AIO 360mm',360,300,190],
  ].map(([name,type,size,maxTdp,usd])=>{
    const stock=name==='AMD Wraith Stealth'||name==='Intel Laminar RM1'
    const compatibleSockets=name==='AMD Wraith Stealth'?['AM4','AM5']:name==='Intel Laminar RM1'?['LGA1700','LGA1851']:['AM4','AM5','LGA1700','LGA1851']
    return {id:idFor(name),name,type,size,maxTdp,stock,compatibleSockets,...(stock?price(0):type==='Aire'?price(usd):streetPrice(size===240?155000:180000))}
  }),
  motherboard: [
    ['MSI B450M PRO-VDH MAX','AM4','B450','DDR4',4,'Micro-ATX',1,78],['ASUS PRIME B450M-A II','AM4','B450','DDR4',4,'Micro-ATX',1,82],['MSI B550M PRO-VDH WIFI','AM4','B550','DDR4',4,'Micro-ATX',2,105],['ASUS TUF Gaming B550-PLUS','AM4','B550','DDR4',4,'ATX',2,140],
    ['ASRock A620M-HDV/M.2+','AM5','A620','DDR5',2,'Micro-ATX',2,100],['ASRock B650M Pro RS','AM5','B650','DDR5',4,'Micro-ATX',3,150],
    ['MSI MAG B650 Tomahawk WiFi','AM5','B650','DDR5',4,'ATX',3,220],['Gigabyte X870 AORUS Elite WiFi7','AM5','X870','DDR5',4,'ATX',4,290],
    ['MSI PRO H610M-G DDR4','LGA1700','H610','DDR4',2,'Micro-ATX',1,75],['Gigabyte B760M DS3H DDR4','LGA1700','B760','DDR4',4,'Micro-ATX',2,110],['MSI PRO B760-P WiFi DDR4','LGA1700','B760','DDR4',4,'ATX',2,155],
    ['MSI PRO B760M-A WiFi DDR5','LGA1700','B760','DDR5',4,'Micro-ATX',2,165],['ASUS TUF Z790-PLUS WiFi','LGA1700','Z790','DDR5',4,'ATX',4,250],['MSI PRO B860M-A WiFi','LGA1851','B860','DDR5',4,'Micro-ATX',3,190],['ASRock Z890 Pro RS WiFi','LGA1851','Z890','DDR5',4,'ATX',4,240],
  ].map(([name,socket,chipset,ramType,ramSlots,formFactor,m2,usd])=>({id:idFor(name),name,socket,chipset,ramType,ramSlots,formFactor,m2,...price(usd)})),
  ram: [
    ['Kingston Fury Beast 16GB (2x8) DDR4-3200','DDR4',16,2,3200,'CL16',38],['Corsair Vengeance LPX 16GB (2x8) DDR4-3200','DDR4',16,2,3200,'CL16',40],['TeamGroup Vulcan Z 32GB (2x16) DDR4-3600','DDR4',32,2,3600,'CL18',58],['Corsair Vengeance LPX 32GB (2x16) DDR4-3600','DDR4',32,2,3600,'CL18',65],
    ['G.Skill Ripjaws V 64GB (2x32) DDR4-3600','DDR4',64,2,3600,'CL18',125],['Crucial Pro 16GB (2x8) DDR5-5200','DDR5',16,2,5200,'CL42',52],['Kingston Fury Beast 16GB (2x8) DDR5-5200','DDR5',16,2,5200,'CL40',55],['Kingston Fury Beast 32GB (2x16) DDR5-6000','DDR5',32,2,6000,'CL36',88],
    ['G.Skill Flare X5 32GB (2x16) DDR5-6000 CL30','DDR5',32,2,6000,'CL30',110],['G.Skill Trident Z5 Neo 32GB (2x16) DDR5-6000 CL30','DDR5',32,2,6000,'CL30',125],['Corsair Vengeance 64GB (2x32) DDR5-6000','DDR5',64,2,6000,'CL30',190],['Kingston Fury Beast 64GB (2x32) DDR5-5600','DDR5',64,2,5600,'CL40',170],
    ['TeamGroup T-Create Expert 96GB (2x48) DDR5-6000','DDR5',96,2,6000,'CL38',260],['Corsair Vengeance LPX 32GB (2x16) DDR4-3200','DDR4',32,2,3200,'CL16',60],['Crucial Pro 32GB (2x16) DDR5-5600','DDR5',32,2,5600,'CL46',82],
  ].map(([name,type,capacity,modules,frequency,timings,usd])=>{
    const streetUsd={
      'Kingston Fury Beast 16GB (2x8) DDR4-3200':55,'Corsair Vengeance LPX 16GB (2x8) DDR4-3200':55,
      'TeamGroup Vulcan Z 32GB (2x16) DDR4-3600':105,'Corsair Vengeance LPX 32GB (2x16) DDR4-3600':105,
      'Crucial Pro 16GB (2x8) DDR5-5200':75,'Kingston Fury Beast 16GB (2x8) DDR5-5200':75,
      'Kingston Fury Beast 32GB (2x16) DDR5-6000':145,'G.Skill Flare X5 32GB (2x16) DDR5-6000 CL30':145,
      'G.Skill Trident Z5 Neo 32GB (2x16) DDR5-6000 CL30':155,
      'Corsair Vengeance 64GB (2x32) DDR5-6000':260,'Kingston Fury Beast 64GB (2x32) DDR5-5600':260,
    }
    return {id:idFor(name),name,type,capacity,modules,frequency,timings,...price(streetUsd[name]??usd)}
  }),
  gpu: [
    ['Radeon RX 6600 8GB (PowerColor Fighter)','AMD',8,132,200,48,205],['GeForce RTX 3060 12GB (MSI Ventus 2X)','NVIDIA',12,170,235,52,270],['Intel Arc B580 12GB (Intel Limited Edition)','Intel',12,190,272,68,250],['GeForce RTX 4060 8GB (MSI Ventus 2X)','NVIDIA',8,115,199,58,295],
    ['GeForce RTX 4060 Ti 16GB (MSI Ventus 2X)','NVIDIA',16,165,199,70,430],['Radeon RX 7600 XT 16GB (Sapphire Pulse)','AMD',16,190,250,63,340],['Radeon RX 7700 XT 12GB (Sapphire Pulse)','AMD',12,245,320,73,400],['Radeon RX 7800 XT 16GB (Sapphire Pulse)','AMD',16,263,280,82,500],
    ['GeForce RTX 5060 8GB (MSI Ventus 2X)','NVIDIA',8,145,197,72,320],['GeForce RTX 5070 12GB (NVIDIA Founders Edition)','NVIDIA',12,250,242,85,550],['Radeon RX 7900 GRE 16GB (Sapphire Pulse)','AMD',16,260,320,85,580],['GeForce RTX 4070 SUPER 12GB (NVIDIA Founders Edition)','NVIDIA',12,220,244,84,600],
    ['GeForce RTX 4070 Ti SUPER 16GB (NVIDIA Founders Edition)','NVIDIA',16,285,304,91,800],['Radeon RX 7900 XTX 24GB (Sapphire Pulse)','AMD',24,355,313,98,900],['GeForce RTX 5070 Ti 16GB (NVIDIA Founders Edition)','NVIDIA',16,300,304,94,750],['GeForce RTX 5080 16GB (NVIDIA Founders Edition)','NVIDIA',16,360,304,100,1000],
  ].map(([name,brand,vram,tdp,length,score,usd])=>{
    const streetUsd={
      'Radeon RX 6600 8GB (PowerColor Fighter)':255,'GeForce RTX 3060 12GB (MSI Ventus 2X)':320,
      'Intel Arc B580 12GB (Intel Limited Edition)':300,'GeForce RTX 4060 8GB (MSI Ventus 2X)':360,
      'GeForce RTX 4060 Ti 16GB (MSI Ventus 2X)':470,'Radeon RX 7600 XT 16GB (Sapphire Pulse)':390,
      'Radeon RX 7700 XT 12GB (Sapphire Pulse)':460,'Radeon RX 7800 XT 16GB (Sapphire Pulse)':530,
      'GeForce RTX 5060 8GB (MSI Ventus 2X)':400,'GeForce RTX 5070 12GB (NVIDIA Founders Edition)':650,
      'Radeon RX 7900 GRE 16GB (Sapphire Pulse)':600,'GeForce RTX 4070 SUPER 12GB (NVIDIA Founders Edition)':680,
      'GeForce RTX 4070 Ti SUPER 16GB (NVIDIA Founders Edition)':800,'Radeon RX 7900 XTX 24GB (Sapphire Pulse)':900,
      'GeForce RTX 5070 Ti 16GB (NVIDIA Founders Edition)':800,'GeForce RTX 5080 16GB (NVIDIA Founders Edition)':1200,
    }
    return {id:idFor(name),name,brand,vram,tdp,length,score,...price(streetUsd[name]??usd)}
  }),
  storage: [
    ['Kingston NV2 500GB','NVMe M.2 PCIe 4.0',500,3500,38],['Kingston NV3 500GB','NVMe M.2 PCIe 4.0',500,5000,42],['Samsung 980 500GB','NVMe M.2 PCIe 3.0',500,3100,48],['Kingston NV2 1TB','NVMe M.2 PCIe 4.0',1000,3500,55],
    ['Kingston NV3 1TB','NVMe M.2 PCIe 4.0',1000,6000,62],['WD Black SN770 1TB','NVMe M.2 PCIe 4.0',1000,5150,75],['Crucial P3 Plus 1TB','NVMe M.2 PCIe 4.0',1000,5000,62],['Samsung 990 PRO 1TB','NVMe M.2 PCIe 4.0',1000,7450,105],
    ['Kingston NV3 2TB','NVMe M.2 PCIe 4.0',2000,6000,100],['WD Black SN850X 2TB','NVMe M.2 PCIe 4.0',2000,7300,145],['Crucial P3 Plus 2TB','NVMe M.2 PCIe 4.0',2000,5000,105],['Samsung 990 PRO 2TB','NVMe M.2 PCIe 4.0',2000,7450,170],
    ['WD Black SN770 2TB','NVMe M.2 PCIe 4.0',2000,5150,125],['Kingston NV2 2TB','NVMe M.2 PCIe 4.0',2000,3500,90],['WD Black SN850X 4TB','NVMe M.2 PCIe 4.0',4000,7300,300],['Samsung 990 PRO 4TB','NVMe M.2 PCIe 4.0',4000,7450,330],
  ].map(([name,type,capacity,readSpeed,usd])=>({id:idFor(name),name,type,capacity,readSpeed,...price(usd)})),
  psu: [
    ['Corsair CV550','550W','80+ Bronze','No',550,false,55],['XPG Pylon 550W','550W','80+ Bronze','No',550,false,60],['Cooler Master MWE 650 Bronze V2','650W','80+ Bronze','No',650,false,70],['Corsair CX650','650W','80+ Bronze','No',650,false,75],
    ['MSI MAG A650BN','650W','80+ Bronze','No',650,false,68],['Seasonic Focus GX-750','750W','80+ Gold','Sí',750,false,125],['MSI MAG A750GL PCIE5','750W','80+ Gold','Sí',750,true,100],['Corsair RM750e ATX 3.0','750W','80+ Gold','Sí',750,true,110],
    ['Corsair RM850e ATX 3.0','850W','80+ Gold','Sí',850,true,120],['be quiet! Pure Power 12 M 850W','850W','80+ Gold','Sí',850,true,145],['Thermaltake Toughpower GF A3 850W','850W','80+ Gold','Sí',850,true,125],['EVGA SuperNOVA 850 G6','850W','80+ Gold','Sí',850,false,140],
    ['be quiet! Pure Power 12 M 1000W','1000W','80+ Gold','Sí',1000,true,180],['FSP Hydro G Pro 1000W','1000W','80+ Gold','Sí',1000,false,165],['Corsair RM1000x SHIFT ATX 3.0','1000W','80+ Gold','Sí',1000,true,210],
  ].map(([name,wattLabel,certification,modular,watts,atx3,usd])=>({id:idFor(name),name,watts,wattLabel,certification,modular,atx3,...price(usd)})),
  case: [
    ['Tecware Forge M Omni','Micro-ATX',330,165,false,65],['Kolink Observatory Lite Mesh','ATX',335,160,false,70],['Corsair 4000D Airflow','ATX',360,170,true,95],['NZXT H5 Flow (2024)','ATX',365,165,false,90],
    ['NZXT H6 Flow','ATX',365,163,true,110],['Lian Li Lancool 216','ATX',392,180,true,110],['HYTE Y60','ATX',375,160,false,200],['Montech Air 100 ARGB','Micro-ATX',330,161,false,65],
    ['Fractal Pop Air','ATX',405,170,true,90],['DeepCool CH560','ATX',380,175,true,105],['ASUS Prime AP201','Micro-ATX',338,170,false,80],['Cooler Master NR200P V2','Mini-ITX',357,155,false,120],
    ['Fractal Meshify 2 Compact','ATX',341,169,true,130],['Lian Li Lancool 205M Mesh','Micro-ATX',350,160,false,75],['NZXT H7 Flow (2024)','ATX',410,185,true,130],
  ].map(([name,formFactor,maxGpuLength,maxCoolerHeight,radiator360,usd])=>({id:idFor(name),name,formFactors:formFactor==='ATX'?['ATX','Micro-ATX','Mini-ITX']:formFactor==='Micro-ATX'?['Micro-ATX','Mini-ITX']:['Mini-ITX'],maxGpuLength,maxCoolerHeight,radiator360,radiators:radiator360?[240,360]:[240],formFactor,...price(usd)})),
}

// Las claves exactas de cada tipo de producto se verifican aquí para evitar datos incompletos.
export const componentSchemas = Object.fromEntries(Object.entries(components).map(([category,items])=>[category,Object.keys(items[0])]))
for (const [category,items] of Object.entries(components)) {
  const keys = componentSchemas[category].slice().sort().join('|')
  if (items.some(item=>Object.keys(item).slice().sort().join('|')!==keys)) throw new Error(`Catálogo ${category}: propiedades inconsistentes`)
  if (new Set(items.map(item=>item.id)).size!==items.length) throw new Error(`Catálogo ${category}: IDs duplicados`)
}

export const categories = [
  ['cpu','Procesador','CPU'],['cooler','Refrigeración','COOLER'],['motherboard','Placa madre','MOTHERBOARD'],['ram','Memoria RAM','RAM'],['gpu','Placa de video','GPU'],['storage','Almacenamiento','SSD'],['psu','Fuente de poder','PSU'],['case','Gabinete','GABINETE'],
]
