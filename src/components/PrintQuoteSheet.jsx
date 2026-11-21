const technicalDescription=(key,item)=>{
  if(!item)return 'Pendiente de selección'
  switch(key){
    case 'cpu':return `${item.socket} · ${item.generation||''} · ${item.tdp}W`.trim()
    case 'cooler':return item.stock?`Incluido en caja · ${item.name}`:`${item.type} · ${item.size}mm · hasta ${item.maxTdp}W`
    case 'motherboard':return `${item.socket} · ${item.chipset} · ${item.ramType} · ${item.formFactor}`
    case 'ram':return `${item.capacity}GB · kit ${item.modules}×${Math.round(item.capacity/item.modules)}GB · ${item.type} ${item.frequency}MHz ${item.timings||''}`
    case 'gpu':return `${item.vram}GB · ${item.tdp}W · ${item.length}mm`
    case 'storage':return `${item.capacity>=1000?`${item.capacity/1000}TB`:`${item.capacity}GB`} · ${item.type} · ${item.readSpeed}MB/s`
    case 'psu':return `${item.watts}W · ${item.certification} · ${item.atx3?'ATX 3 / PCIe 5':''}`
    case 'case':return `${item.formFactor} · GPU hasta ${item.maxGpuLength}mm · radiadores ${(item.radiators||[]).join(', ')}mm`
    default:return item.name
  }
}

const countLabel=(key,item,quantity)=>{
  if(!item)return '—'
  if(key==='ram')return `${item.modules} módulos (Kit ${item.modules}×${Math.round(item.capacity/item.modules)}GB)${quantity>1?` × ${quantity} kits`:''}`
  return `${quantity} u.`
}

export default function PrintQuoteSheet({regionName,regionalEnabled,regionalPercent,categories,build,quantities,priceOf,formatMoney,formatQuote,currency,rate,paymentMode,quoteUpdated,use,draw,bottleneck,alerts,total,includeLinks}){
  const today=new Intl.DateTimeFormat('es-AR',{dateStyle:'long'}).format(new Date())
  const paymentLabel=paymentMode==='installments'?'Lista / Cuotas':'Contado / Transferencia'
  const technicalAlerts=alerts.filter(item=>item.level==='critical'||item.level==='warning')
  const quantityFor=key=>Math.max(1,Number(quantities[key])||1)
  return <section className="print-quote-sheet hidden print:block" aria-label="Hoja de presupuesto para imprimir">
    <header className="quote-print-header"><div><div className="quote-print-brand">PC BUILDER PRO</div><h1>PRESUPUESTO DE ARMADO DE PC</h1></div><div className="quote-print-meta"><b>Fecha:</b> {today}<br/><b>Uso:</b> {use}<br/><b>Provincia:</b> {regionName}<br/><b>Logística estimada:</b> {regionalEnabled?`+${regionalPercent}% en precios base`:`desactivada (${regionalPercent}% configurado)`}<br/><b>Modalidad:</b> {paymentLabel}<br/><b>Cotización:</b> 1 USD = {formatQuote(rate)} {quoteUpdated&&<><br/><b>Actualizada:</b> {new Date(quoteUpdated).toLocaleString('es-AR')}</>}</div></header>
    <table className="quote-print-table"><thead><tr><th>Categoría</th><th>Componente / Descripción técnica</th><th>Cant.</th><th>Precio unitario</th><th>Subtotal</th></tr></thead><tbody>{categories.map(([key,title])=>{const item=build[key],qty=quantityFor(key),unit=item?priceOf(key,item,currency):0;return <tr key={key}><td>{title}</td><td><strong>{item?.name||'Pendiente de selección'}</strong><small>{technicalDescription(key,item)}</small>{includeLinks&&item&&<a href={`https://www.hardgamers.com.ar/search?text=${encodeURIComponent(item.name)}`} className="quote-print-link">Buscar en HardGamers</a>}</td><td>{countLabel(key,item,qty)}</td><td>{item?formatMoney(unit,currency):'—'}</td><td>{item?formatMoney(unit*qty,currency):'—'}</td></tr>})}</tbody></table>
    <section className="quote-print-tech"><h2>Resumen técnico</h2><div><span>Consumo estimado</span><b>{draw}W</b><span>Equilibrio CPU / GPU</span><b>{bottleneck.percent}% cuello de botella</b></div>{technicalAlerts.length?<aside className="quote-print-alerts"><h3>Advertencias de BIOS y compatibilidad</h3><ul>{technicalAlerts.map((alert,index)=><li key={`${alert.title}-${index}`}><b>{alert.title}:</b> {alert.detail}</li>)}</ul></aside>:<p className="quote-print-ok">Compatibilidad verificada sin alertas.</p>}</section>
    <footer className="quote-print-total"><span>TOTAL GENERAL · {paymentLabel}</span><strong>{formatMoney(total,currency)}</strong>{currency==='USD'&&<small>Equivalente estimado: {formatMoney(total*rate,'ARS')}</small>}{currency==='ARS'&&<small>Equivalente estimado: {formatMoney(total/rate,'USD')}</small>}</footer>
    <p className="quote-print-disclaimer">Presupuesto referencial sujeto a disponibilidad y variación de precios. La compatibilidad debe confirmarse con la tienda antes de la compra.</p>
  </section>
}
