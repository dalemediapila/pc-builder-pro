// Valores de respaldo de calle para Argentina. priceArs conserva la referencia ARS
// calibrada; price es la referencia USD orientativa y los precios en vivo la sustituyen.
export const REFERENCE_ARS_PER_USD = 1675
const price = (usd) => {
  const priceArs=Math.round(usd*REFERENCE_ARS_PER_USD)
  return {price:Number((priceArs/REFERENCE_ARS_PER_USD).toFixed(2)),priceArs}
}
const streetPrice = ars => ({price:Number((ars/REFERENCE_ARS_PER_USD).toFixed(2)),priceArs:Math.round(ars)})
const idFor = name => name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')
const catalogStreetPrices = {
  cpu: {
    'Ryzen 5 5500':[135,185000],'Ryzen 5 5600':[150,210000],'Ryzen 7 5800X3D':[400,550000],
    'Core i3-12100F':[120,165000],'Core i5-12400F':[160,220000],'Core i5-13400F':[245,340000],'Core i5-14400F':[260,360000],
    'Ryzen 5 7600':[250,340000],'Ryzen 5 8600G':[245,335000],'Core Ultra 5 245K':[360,500000],
    'Ryzen 7 7800X3D':[500,690000],'Ryzen 7 9800X3D':[600,820000],'Ryzen 9 9950X':[800,1100000],
    'Core i7-14700K':[580,800000],'Core Ultra 7 265K':[470,650000],'Core Ultra 9 285K':[650,900000],
  },
  cooler: {
    'ID-Cooling SE-214-XT':[33,45000],'DeepCool AK400':[44,60000],'Cooler Master Hyper 212 Halo':[55,75000],
    'Thermalright Peerless Assassin 120 SE':[66,90000],'Thermalright Peerless Assassin 120':[70,96000],
    'DeepCool AK620':[88,120000],'Noctua NH-U12S redux':[80,110000],'be quiet! Pure Rock 2':[73,100000],
  },
  motherboard: {
    'MSI B450M PRO-VDH MAX':[100,140000],'ASUS PRIME B450M-A II':[112,155000],
    'MSI B550M PRO-VDH WIFI':[152,210000],'ASUS TUF Gaming B550-PLUS':[196,270000],
    'ASRock A620M-HDV/M.2+':[130,180000],'ASRock B650M Pro RS':[195,270000],
    'MSI MAG B650 Tomahawk WiFi':[232,320000],'Gigabyte X870 AORUS Elite WiFi7':[470,650000],
    'MSI PRO H610M-G DDR4':[98,135000],'Gigabyte B760M DS3H DDR4':[152,210000],
    'MSI PRO B760-P WiFi DDR4':[203,280000],'MSI PRO B760M-A WiFi DDR5':[218,300000],
    'ASUS TUF Z790-PLUS WiFi':[406,560000],'MSI PRO B860M-A WiFi':[275,380000],'ASRock Z890 Pro RS WiFi':[500,690000],
  },
  ram: {
    'Kingston Fury Beast 16GB (2x8) DDR4-3200':[180,245000],'Corsair Vengeance LPX 16GB (2x8) DDR4-3200':[180,245000],
    'TeamGroup Vulcan Z 32GB (2x16) DDR4-3600':[355,490000],'Corsair Vengeance LPX 32GB (2x16) DDR4-3600':[355,490000],
    'G.Skill Ripjaws V 64GB (2x32) DDR4-3600':[580,800000],
    'Crucial Pro 16GB (2x8) DDR5-5200':[330,450000],'Kingston Fury Beast 16GB (2x8) DDR5-5200':[330,450000],
    'Kingston Fury Beast 32GB (2x16) DDR5-6000':[680,930000],
    'G.Skill Flare X5 32GB (2x16) DDR5-6000 CL30':[720,980000],'G.Skill Trident Z5 Neo 32GB (2x16) DDR5-6000 CL30':[750,1020000],
    'Corsair Vengeance 64GB (2x32) DDR5-6000':[990,1350000],'Kingston Fury Beast 64GB (2x32) DDR5-5600':[950,1300000],
    'TeamGroup T-Create Expert 96GB (2x48) DDR5-6000':[1320,1800000],
    'Corsair Vengeance LPX 32GB (2x16) DDR4-3200':[355,490000],'Crucial Pro 32GB (2x16) DDR5-5600':[690,940000],
  },
  gpu: {
    'Radeon RX 6600 8GB (PowerColor Fighter)':[275,380000],'GeForce RTX 3060 12GB (MSI Ventus 2X)':[340,470000],
    'Intel Arc B580 12GB (Intel Limited Edition)':[390,540000],'GeForce RTX 4060 8GB (MSI Ventus 2X)':[380,520000],
    'GeForce RTX 4060 Ti 16GB (MSI Ventus 2X)':[470,650000],'Radeon RX 7600 XT 16GB (Sapphire Pulse)':[430,590000],
    'Radeon RX 7700 XT 12GB (Sapphire Pulse)':[565,780000],'Radeon RX 7800 XT 16GB (Sapphire Pulse)':[620,860000],
    'GeForce RTX 5060 8GB (MSI Ventus 2X)':[405,560000],'GeForce RTX 5070 12GB (NVIDIA Founders Edition)':[690,950000],
    'Radeon RX 7900 GRE 16GB (Sapphire Pulse)':[650,900000],'GeForce RTX 4070 SUPER 12GB (NVIDIA Founders Edition)':[690,950000],
    'GeForce RTX 4070 Ti SUPER 16GB (NVIDIA Founders Edition)':[870,1200000],'Radeon RX 7900 XTX 24GB (Sapphire Pulse)':[1100,1500000],
    'GeForce RTX 5070 Ti 16GB (NVIDIA Founders Edition)':[980,1350000],'GeForce RTX 5080 16GB (NVIDIA Founders Edition)':[1400,1950000],
  },
  storage: {
    'Kingston NV2 500GB':[62,85000],'Kingston NV3 500GB':[68,93000],'Samsung 980 500GB':[75,103000],
    'Kingston NV2 1TB':[105,145000],'Kingston NV3 1TB':[112,155000],'WD Black SN770 1TB':[140,195000],
    'Crucial P3 Plus 1TB':[120,165000],'Samsung 990 PRO 1TB':[190,265000],
    'Kingston NV3 2TB':[190,260000],'WD Black SN850X 2TB':[340,470000],'Crucial P3 Plus 2TB':[205,285000],
    'Samsung 990 PRO 2TB':[360,500000],'WD Black SN770 2TB':[245,340000],'Kingston NV2 2TB':[175,240000],
    'WD Black SN850X 4TB':[650,900000],'Samsung 990 PRO 4TB':[800,1100000],
  },
  psu: {
    'Corsair CV550':[80,110000],'XPG Pylon 550W':[90,125000],'Cooler Master MWE 650 Bronze V2':[95,130000],
    'Corsair CX650':[98,135000],'MSI MAG A650BN':[90,125000],
    'Seasonic Focus GX-750':[180,250000],'MSI MAG A750GL PCIE5':[145,200000],'Corsair RM750e ATX 3.0':[155,215000],
    'Corsair RM850e ATX 3.0':[190,265000],'be quiet! Pure Power 12 M 850W':[220,305000],
    'Thermaltake Toughpower GF A3 850W':[200,275000],'EVGA SuperNOVA 850 G6':[210,290000],
    'be quiet! Pure Power 12 M 1000W':[300,415000],'FSP Hydro G Pro 1000W':[275,380000],'Corsair RM1000x SHIFT ATX 3.0':[340,470000],
  },
  case: {
    'Tecware Forge M Omni':[80,110000],'Kolink Observatory Lite Mesh':[95,130000],'Corsair 4000D Airflow':[135,185000],
    'NZXT H5 Flow (2024)':[130,180000],'NZXT H6 Flow':[160,220000],'Lian Li Lancool 216':[155,215000],
    'HYTE Y60':[310,430000],'Montech Air 100 ARGB':[90,125000],'Fractal Pop Air':[145,200000],
    'DeepCool CH560':[155,215000],'ASUS Prime AP201':[125,175000],'Cooler Master NR200P V2':[190,265000],
    'Fractal Meshify 2 Compact':[210,290000],'Lian Li Lancool 205M Mesh':[105,145000],'NZXT H7 Flow (2024)':[210,290000],
  },
}
const catalogPrice = (category,name,usd) => {
  const fixed=catalogStreetPrices[category]?.[name]
  return fixed?{price:fixed[0],priceArs:fixed[1]}:price(usd)
}

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
    return {id:idFor(name),name,brand,socket,tdp,score,stockCooler:Boolean(stockCoolerName),stockCoolerName,generation,...catalogPrice('cpu',name,corrected)}
  }),
  cooler: [
    ['AMD Wraith Stealth','Aire',54,65,0],['Intel Laminar RM1','Aire',47,65,0],['ID-Cooling SE-214-XT','Aire',150,180,22],['DeepCool AK400','Aire',155,220,32],['Cooler Master Hyper 212 Halo','Aire',154,180,42],
    ['Thermalright Peerless Assassin 120 SE','Aire',157,260,38],['Thermalright Peerless Assassin 120','Aire',157,260,43],['DeepCool AK620','Aire',160,260,65],['Noctua NH-U12S redux','Aire',158,180,55],['be quiet! Pure Rock 2','Aire',155,150,45],
    ['Arctic Liquid Freezer III 240','AIO 240mm',240,300,90],['Corsair iCUE H100i Elite Capellix XT','AIO 240mm',240,250,140],['NZXT Kraken 240','AIO 240mm',240,250,140],['Arctic Liquid Freezer III 360','AIO 360mm',360,350,120],
    ['Corsair iCUE H150i Elite Capellix XT','AIO 360mm',360,300,180],['NZXT Kraken 360','AIO 360mm',360,300,190],
  ].map(([name,type,size,maxTdp,usd])=>{
    const stock=name==='AMD Wraith Stealth'||name==='Intel Laminar RM1'
    const compatibleSockets=name==='AMD Wraith Stealth'?['AM4','AM5']:name==='Intel Laminar RM1'?['LGA1700','LGA1851']:['AM4','AM5','LGA1700','LGA1851']
    return {id:idFor(name),name,type,size,maxTdp,stock,compatibleSockets,...(stock?price(0):type==='Aire'?catalogPrice('cooler',name,usd):streetPrice(size===240?155000:180000))}
  }),
  motherboard: [
    ['MSI B450M PRO-VDH MAX','AM4','B450','DDR4',4,'Micro-ATX',1,78],['ASUS PRIME B450M-A II','AM4','B450','DDR4',4,'Micro-ATX',1,82],['MSI B550M PRO-VDH WIFI','AM4','B550','DDR4',4,'Micro-ATX',2,105],['ASUS TUF Gaming B550-PLUS','AM4','B550','DDR4',4,'ATX',2,140],
    ['ASRock A620M-HDV/M.2+','AM5','A620','DDR5',2,'Micro-ATX',2,100],['ASRock B650M Pro RS','AM5','B650','DDR5',4,'Micro-ATX',3,150],
    ['MSI MAG B650 Tomahawk WiFi','AM5','B650','DDR5',4,'ATX',3,220],['Gigabyte X870 AORUS Elite WiFi7','AM5','X870','DDR5',4,'ATX',4,290],
    ['MSI PRO H610M-G DDR4','LGA1700','H610','DDR4',2,'Micro-ATX',1,75],['Gigabyte B760M DS3H DDR4','LGA1700','B760','DDR4',4,'Micro-ATX',2,110],['MSI PRO B760-P WiFi DDR4','LGA1700','B760','DDR4',4,'ATX',2,155],
    ['MSI PRO B760M-A WiFi DDR5','LGA1700','B760','DDR5',4,'Micro-ATX',2,165],['ASUS TUF Z790-PLUS WiFi','LGA1700','Z790','DDR5',4,'ATX',4,250],['MSI PRO B860M-A WiFi','LGA1851','B860','DDR5',4,'Micro-ATX',3,190],['ASRock Z890 Pro RS WiFi','LGA1851','Z890','DDR5',4,'ATX',4,240],
  ].map(([name,socket,chipset,ramType,ramSlots,formFactor,m2,usd])=>({id:idFor(name),name,socket,chipset,ramType,ramSlots,formFactor,m2,...catalogPrice('motherboard',name,usd)})),
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
    return {id:idFor(name),name,type,capacity,modules,frequency,timings,...catalogPrice('ram',name,streetUsd[name]??usd)}
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
    return {id:idFor(name),name,brand,vram,tdp,length,score,...catalogPrice('gpu',name,streetUsd[name]??usd)}
  }),
  storage: [
    ['Kingston NV2 500GB','NVMe M.2 PCIe 4.0',500,3500,38],['Kingston NV3 500GB','NVMe M.2 PCIe 4.0',500,5000,42],['Samsung 980 500GB','NVMe M.2 PCIe 3.0',500,3100,48],['Kingston NV2 1TB','NVMe M.2 PCIe 4.0',1000,3500,55],
    ['Kingston NV3 1TB','NVMe M.2 PCIe 4.0',1000,6000,62],['WD Black SN770 1TB','NVMe M.2 PCIe 4.0',1000,5150,75],['Crucial P3 Plus 1TB','NVMe M.2 PCIe 4.0',1000,5000,62],['Samsung 990 PRO 1TB','NVMe M.2 PCIe 4.0',1000,7450,105],
    ['Kingston NV3 2TB','NVMe M.2 PCIe 4.0',2000,6000,100],['WD Black SN850X 2TB','NVMe M.2 PCIe 4.0',2000,7300,145],['Crucial P3 Plus 2TB','NVMe M.2 PCIe 4.0',2000,5000,105],['Samsung 990 PRO 2TB','NVMe M.2 PCIe 4.0',2000,7450,170],
    ['WD Black SN770 2TB','NVMe M.2 PCIe 4.0',2000,5150,125],['Kingston NV2 2TB','NVMe M.2 PCIe 4.0',2000,3500,90],['WD Black SN850X 4TB','NVMe M.2 PCIe 4.0',4000,7300,300],['Samsung 990 PRO 4TB','NVMe M.2 PCIe 4.0',4000,7450,330],
  ].map(([name,type,capacity,readSpeed,usd])=>({id:idFor(name),name,type,capacity,readSpeed,...catalogPrice('storage',name,usd)})),
  psu: [
    ['Corsair CV550','550W','80+ Bronze','No',550,false,55],['XPG Pylon 550W','550W','80+ Bronze','No',550,false,60],['Cooler Master MWE 650 Bronze V2','650W','80+ Bronze','No',650,false,70],['Corsair CX650','650W','80+ Bronze','No',650,false,75],
    ['MSI MAG A650BN','650W','80+ Bronze','No',650,false,68],['Seasonic Focus GX-750','750W','80+ Gold','Sí',750,false,125],['MSI MAG A750GL PCIE5','750W','80+ Gold','Sí',750,true,100],['Corsair RM750e ATX 3.0','750W','80+ Gold','Sí',750,true,110],
    ['Corsair RM850e ATX 3.0','850W','80+ Gold','Sí',850,true,120],['be quiet! Pure Power 12 M 850W','850W','80+ Gold','Sí',850,true,145],['Thermaltake Toughpower GF A3 850W','850W','80+ Gold','Sí',850,true,125],['EVGA SuperNOVA 850 G6','850W','80+ Gold','Sí',850,false,140],
    ['be quiet! Pure Power 12 M 1000W','1000W','80+ Gold','Sí',1000,true,180],['FSP Hydro G Pro 1000W','1000W','80+ Gold','Sí',1000,false,165],['Corsair RM1000x SHIFT ATX 3.0','1000W','80+ Gold','Sí',1000,true,210],
  ].map(([name,wattLabel,certification,modular,watts,atx3,usd])=>({id:idFor(name),name,watts,wattLabel,certification,modular,atx3,...catalogPrice('psu',name,usd)})),
  case: [
    ['Tecware Forge M Omni','Micro-ATX',330,165,false,65],['Kolink Observatory Lite Mesh','ATX',335,160,false,70],['Corsair 4000D Airflow','ATX',360,170,true,95],['NZXT H5 Flow (2024)','ATX',365,165,false,90],
    ['NZXT H6 Flow','ATX',365,163,true,110],['Lian Li Lancool 216','ATX',392,180,true,110],['HYTE Y60','ATX',375,160,false,200],['Montech Air 100 ARGB','Micro-ATX',330,161,false,65],
    ['Fractal Pop Air','ATX',405,170,true,90],['DeepCool CH560','ATX',380,175,true,105],['ASUS Prime AP201','Micro-ATX',338,170,false,80],['Cooler Master NR200P V2','Mini-ITX',357,155,false,120],
    ['Fractal Meshify 2 Compact','ATX',341,169,true,130],['Lian Li Lancool 205M Mesh','Micro-ATX',350,160,false,75],['NZXT H7 Flow (2024)','ATX',410,185,true,130],
  ].map(([name,formFactor,maxGpuLength,maxCoolerHeight,radiator360,usd])=>({id:idFor(name),name,formFactors:formFactor==='ATX'?['ATX','Micro-ATX','Mini-ITX']:formFactor==='Micro-ATX'?['Micro-ATX','Mini-ITX']:['Mini-ITX'],maxGpuLength,maxCoolerHeight,radiator360,radiators:radiator360?[240,360]:[240],formFactor,...catalogPrice('case',name,usd)})),
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
