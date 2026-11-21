export function evaluateCompatibility(build) {
  const a = []
  const add = (level,title,detail) => a.push({level,title,detail})
  const {cpu, cooler, motherboard, ram, gpu, psu, case: pcCase} = build
  if (cpu && motherboard && cpu.socket !== motherboard.socket) add('critical','Socket incompatible',`${cpu.name} usa ${cpu.socket}; ${motherboard.name} usa ${motherboard.socket}.`)
  if (cpu && cooler && !(cooler.compatibleSockets || []).includes(cpu.socket)) add('critical','Socket de cooler incompatible',`${cooler.name} no es compatible con ${cpu.socket}.`)
  if(cpu&&cooler?.stock&&(!cpu.stockCoolerName||cpu.stockCoolerName!==cooler.name)) add('critical','Cooler stock no corresponde',`${cpu.name} no incluye ${cooler.name} de fábrica. Elegí el cooler incluido correcto o uno dedicado.`)
  if (motherboard && ram && motherboard.ramType !== ram.type) add('critical','Memoria incompatible',`La placa requiere ${motherboard.ramType} y elegiste ${ram.type}.`)
  if (motherboard && ram && ram.modules > motherboard.ramSlots) add('critical','Slots insuficientes',`La RAM usa ${ram.modules} módulos y la placa tiene ${motherboard.ramSlots} slots.`)
  if (cpu && !cooler && !cpu.stockCoolerName) add('critical','Falta refrigeración','Este procesador no incluye cooler de fábrica. Debés seleccionar un cooler de aire o refrigeración líquida compatible.')
  if(cpu&&motherboard&&((['Ryzen 5000','Ryzen 5000X3D'].includes(cpu.generation)&&['B450','A520'].includes(motherboard.chipset))||(['Ryzen 9000','Ryzen 9000X3D'].includes(cpu.generation)&&['A620','B650','X670'].includes(motherboard.chipset))||(['Intel 13th','Intel 14th'].includes(cpu.generation)&&['H610','B660','Z690'].includes(motherboard.chipset)))){
    const detail=['Ryzen 5000','Ryzen 5000X3D'].includes(cpu.generation)?'Advertencia de BIOS: Esta placa madre puede requerir actualización de BIOS para soportar procesadores Ryzen 5000/X3D. Pedí que la actualicen en la tienda antes de retirar.':['Ryzen 9000','Ryzen 9000X3D'].includes(cpu.generation)?'Advertencia de BIOS: Puede requerir actualización de BIOS previa para procesadores Ryzen serie 9000 (usá BIOS Flashback o pedí actualización en la tienda).':'Advertencia de BIOS: Las placas serie 600 requieren actualización de BIOS para soportar procesadores Intel de 13.ª y 14.ª generación.'
    add('warning','Advertencia de BIOS',detail)
  }
  if (cpu && cooler && cpu.tdp > cooler.maxTdp) add('critical','Cooler insuficiente',`El cooler soporta ${cooler.maxTdp}W y el CPU tiene ${cpu.tdp}W de TDP.`)
  if (pcCase && motherboard && !(pcCase.formFactors || []).includes(motherboard.formFactor)) add('critical','Placa no entra en el gabinete',`${pcCase.name} no admite formato ${motherboard.formFactor}.`)
  if (pcCase && gpu && gpu.length > pcCase.maxGpuLength) add('critical','GPU demasiado larga',`${gpu.length}mm de GPU exceden los ${pcCase.maxGpuLength}mm disponibles.`)
  if (pcCase && cooler?.type === 'Aire' && cooler.size > pcCase.maxCoolerHeight) add('critical','Cooler demasiado alto',`${cooler.size}mm exceden los ${pcCase.maxCoolerHeight}mm disponibles.`)
  if (pcCase && cooler?.type.startsWith('AIO') && !(pcCase.radiators || []).includes(cooler.size)) add('critical','Radiador no compatible',`El gabinete ${pcCase.name} no declara soporte para radiador de ${cooler.size}mm.`)
  const draw = (cpu?.tdp || 0) + (gpu?.tdp || 0) + 100
  const watts = psu?.watts || 0
  if (psu && draw > watts) add('critical','Fuente insuficiente',`El consumo estimado es ${draw}W y la fuente entrega ${watts}W.`)
  else if (psu && draw * 1.25 > watts) add('warning','Poco margen en la fuente',`Consumo estimado: ${draw}W. Para un 25% de margen se recomiendan ${Math.ceil(draw*1.25)}W o más.`)
  if (cpu && !cooler && cpu.stockCoolerName) add('info','Cooler stock incluido',`Cooler incluido en caja: ${cpu.stockCoolerName} ($0)`)
  return {alerts:a, draw, psuLoad: watts ? Math.min(100, Math.round(draw/watts*100)) : 0, critical:a.filter(x=>x.level==='critical').length}
}

export function estimateBottleneck(cpu,gpu,use='Gaming 1440p') {
  if (!cpu || !gpu) return {percent:0,limiter:'',message:'Elegí un CPU y una GPU para analizar el equilibrio.'}
  const cpuWeight = {'Gaming 1080p':0.55,'Gaming 1440p':0.5,'Gaming 4K':0.45,'Edición / Renderizado':0.55,'Oficina / Estudio':0.5}[use] ?? 0.5
  const cpuEffective = cpu.score / cpuWeight
  const gpuEffective = gpu.score / (1-cpuWeight)
  const percent = Math.min(45,Math.round(Math.abs(cpuEffective-gpuEffective)/Math.max(cpuEffective,gpuEffective)*100))
  const limiter = cpuEffective < gpuEffective ? 'CPU' : 'GPU'
  const message = percent <= 10 ? 'Procesador y placa de video están bien equilibrados.' : percent <= 20 ? `Desequilibrio leve: el ${limiter} limita el rendimiento del otro componente.` : `Desequilibrio severo: el ${limiter} limita la configuración. Considerá cambiarlo por un modelo de gama más acorde.`
  return {percent,limiter,message}
}

export function findBuild(budget,use,preference) {
  const {cpu,cooler,motherboard,ram,gpu,storage,psu,case:cases}= (globalThis.__pcComponents)
  const candidates=[]
  for(const p of cpu) for(const g of gpu) {
    if(preference==='Intel / NVIDIA' && !(p.brand==='Intel' && g.brand==='NVIDIA')) continue
    if(preference==='Todo AMD' && !(p.brand==='AMD' && g.brand==='AMD')) continue
    const board=motherboard.find(x=>x.socket===p.socket)
    const memory=board && ram.find(x=>x.type===board.ramType && x.capacity>=32)
    const fan=cooler.find(x=>x.maxTdp>=p.tdp && x.type==='Aire')
    const disk=storage.find(x=>x.type.startsWith('NVMe M.2') && x.capacity>=1000)
    const power=psu.find(x=>x.watts>=(p.tdp+g.tdp+100)*1.25)
    const box=cases.find(x=>(x.formFactors || []).includes(board?.formFactor) && x.maxGpuLength>=g.length && (!fan || x.maxCoolerHeight>=fan.size))
    if(!board||!memory||!fan||!disk||!power||!box) continue
    const build={cpu:p,cooler:fan,motherboard:board,ram:memory,gpu:g,storage:disk,psu:power,case:box}
    const cost=Object.values(build).reduce((sum,item)=>sum+item.price,0)
    if(cost<=budget) {
      const score=(p.score+g.score)*1000 + (use.includes('4K')?g.score*10:use.includes('Oficina')?p.score*8:0)
      candidates.push({build,cost,score})
    }
  }
  candidates.sort((a,b)=>b.score-a.score)
  return candidates[0]?.build || null
}
