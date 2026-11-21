import React from 'react'
import { useState } from 'react'
import { Clipboard, Medal, Trophy, Zap } from 'lucide-react'
import { categories } from '../data/components.js'
import { buildMetrics, buildTotal, componentQuality } from '../utils/buildMetrics.js'

const titles=Object.fromEntries(categories.map(([key,title])=>[key,title]))

export default function PCComparison({options,selection,setSelection,priceOf,formatTotal,formatValue,onLoad}){
  const [notice,setNotice]=useState('')
  const selected=selection.map(id=>options.find(x=>x.id===id)||null)
  const columns=selected.map(option=>option?({...option,total:buildTotal(option.build,priceOf),metrics:buildMetrics(option.build,option.use)}):null)
  const availableFor=idx=>options.filter(option=>!selection.some((selectedId,i)=>i!==idx&&selectedId===option.id))
  const cheapest=Math.min(...columns.filter(Boolean).map(x=>x.total),Infinity)
  const bestValue=columns.map((x,i)=>x?{i,value:x.metrics.gaming/Math.max(x.total,1)}:null).filter(Boolean).sort((a,b)=>b.value-a.value)[0]?.i
  const bestGaming=columns.map((x,i)=>x?{i,value:x.metrics.gaming}:null).filter(Boolean).sort((a,b)=>b.value-a.value)[0]?.i
  const componentBest=key=>columns.map((col,i)=>col?.build[key]?{i,value:componentQuality(key,col.build[key])}:null).filter(Boolean).sort((a,b)=>b.value-a.value)[0]?.i
  const copy=async()=>{const text=['📊 COMPARATIVA DE PCs',...columns.map((col,i)=>col?`\n${i+1}. ${col.label}\nPrecio: ${formatTotal(col.total)} · Gaming: ${col.metrics.gaming}/100 · Productividad: ${col.metrics.productivity}/100 · Cuello: ${col.metrics.bottleneck.percent}% · Consumo: ${col.metrics.power}W\n${categories.map(([key,title])=>`• ${title}: ${col.build[key]?.name||'—'}`).join('\n')}`:'').filter(Boolean)].join('\n');try{await navigator.clipboard.writeText(text);setNotice('Comparativa copiada para WhatsApp.')}catch{setNotice(text)}}
  return <section className="comparison-page"><div className="view-heading"><div><div className="eyebrow">DECIDÍ CON DATOS</div><h2>Comparar PCs</h2><p>Elegí hasta tres armados para comparar precio, rendimiento y componentes pieza por pieza.</p></div><button className="button button-quiet" onClick={copy}><Clipboard size={15}/> Copiar comparativa para WhatsApp</button></div>
    <div className="compare-selectors">{selection.map((id,index)=><label key={index}>PC {index+1}<select value={id||''} onChange={e=>setSelection(prev=>prev.map((v,i)=>i===index?e.target.value||null:v))}><option value="">Elegir una configuración…</option>{availableFor(index).map(option=><option key={option.id} value={option.id}>{option.label}</option>)}</select></label>)}</div>
    <div className="comparison-scroll"><table className="comparison-table"><thead><tr><th className="compare-row-label">Indicador</th>{columns.map((col,i)=><th key={i}>{col?<><div className="compare-title">{col.label}</div><div className="compare-badges">{bestValue===i&&<span className="badge-value"><Medal size={12}/> Mejor Calidad/Precio</span>}{bestGaming===i&&<span className="badge-performance"><Trophy size={12}/> Mayor Rendimiento</span>}</div><button className="button button-primary compare-load" onClick={()=>onLoad(col.build,col.use)}>Cargar en el editor</button></>:<span className="empty-column">Configuración no elegida</span>}</th>)}</tr></thead><tbody>
      <tr><th>Precio total</th>{columns.map((col,i)=><td key={i}>{col?<><strong>{formatTotal(col.total)}</strong><small className="price-difference">{col.total===cheapest?'Menor precio':`+ ${formatValue(col.total-cheapest)} sobre la más económica`}</small></>:'—'}</td>)}</tr>
      <tr><th>Precio / rendimiento</th>{columns.map((col,i)=><td key={i}>{col?<>{formatValue(col.total/Math.max(col.metrics.gaming,1))} <small>por punto gaming</small></>:'—'}</td>)}</tr>
      <tr><th>Gaming estimado</th>{columns.map((col,i)=><td key={i}>{col?<ScoreBar value={col.metrics.gaming} best={bestGaming===i}/>:'—'}</td>)}</tr>
      <tr><th>Productividad / edición</th>{columns.map((col,i)=><td key={i}>{col?<ScoreBar value={col.metrics.productivity}/>:'—'}</td>)}</tr>
      <tr><th>Cuello de botella</th>{columns.map((col,i)=><td key={i}>{col?<span className={`compare-bottleneck ${col.metrics.bottleneck.percent>20?'score-red':col.metrics.bottleneck.percent>10?'score-yellow':'score-green'}`}>{col.metrics.bottleneck.percent}% · {col.metrics.bottleneck.limiter||'—'}</span>:'—'}</td>)}</tr>
      <tr><th><Zap size={13}/> Consumo</th>{columns.map((col,i)=><td key={i}>{col?`${col.metrics.power}W`:'—'}</td>)}</tr>
      {categories.map(([key,title])=><tr key={key}><th>{titles[key]||title}</th>{columns.map((col,i)=>{const item=col?.build[key],best=componentBest(key)===i;return <td key={i} className={item&&best?'best-part':''}>{item?<><span>{item.name}</span>{best&&<b className="best-chip">Mejor de la comparación</b>}</>:'Sin seleccionar'}</td>})}</tr>)}
    </tbody></table></div>{notice&&<div className="toast" onClick={()=>setNotice('')}>{notice}<button onClick={()=>setNotice('')}>×</button></div>}</section>
}

function ScoreBar({value,best=false}){return <div className="compare-score"><div className="compare-score-bar"><span className={best?'best-score-fill':''} style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div><b>{value}<small>/100</small></b></div>}
