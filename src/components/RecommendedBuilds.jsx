import React from 'react'
import { ArrowRight, Cpu, Gauge, Zap } from 'lucide-react'
import { recommendedBuilds, resolveRecommendedBuild } from '../data/recommendedBuilds.js'
import { buildMetrics, buildTotal } from '../utils/buildMetrics.js'

export default function RecommendedBuilds({priceOf,formatTotal,onLoad,currency}){
  const [usage,setUsage]=React.useState('Todas'),[budget,setBudget]=React.useState('')
  const cards=recommendedBuilds.map(item=>({item,build:resolveRecommendedBuild(item)})).filter(({item,build})=>{
    const total=buildTotal(build,priceOf)
    const matchesUsage=usage==='Todas'||(usage==='Gaming'&&item.use.startsWith('Gaming'))||(usage==='Productividad'&&!item.use.startsWith('Gaming'))
    return matchesUsage&&(!budget||total<=Number(budget))
  })
  return <section className="recommended-page">
    <div className="view-heading"><div><div className="eyebrow">SELECCIÓN CURADA</div><h2>PCs recomendadas</h2><p>Armados compatibles y equilibrados para distintos usos. Cargá uno al editor y personalizalo.</p></div><div className="recommend-count">{cards.length} configuraciones</div></div>
    <div className="recommend-filters"><label>Uso<select value={usage} onChange={e=>setUsage(e.target.value)}><option>Todas</option><option>Gaming</option><option>Productividad</option></select></label><label>Presupuesto máximo ({currency})<input type="number" min="0" placeholder="Sin límite" value={budget} onChange={e=>setBudget(e.target.value)}/></label></div>
    <div className="recommended-grid">{cards.map(({item,build})=>{const metrics=buildMetrics(build,item.use),total=buildTotal(build,priceOf);const parts=[['CPU',build.cpu],['GPU',build.gpu],['RAM',build.ram],['SSD',build.storage]];return <article className={`recommended-card ${item.id==='gamer_1440_balanced'?'featured-recommendation':''}`} key={item.id}><div className="recommend-card-top"><span className="recommend-tag">{item.tag}</span>{item.id==='gamer_1440_balanced'&&<span className="recommend-star">★ Más recomendada</span>}</div><h3>{item.title}</h3><div className="recommend-stats"><span><Gauge size={14}/> Cuello de botella <b className={metrics.bottleneck.percent>20?'score-red':metrics.bottleneck.percent>10?'score-yellow':'score-green'}>{metrics.bottleneck.percent}%</b></span><span><Zap size={14}/> Consumo <b>{metrics.power}W</b></span></div><div className="recommend-parts">{parts.map(([label,part])=><div key={label}><small>{label}</small><b>{part?.name||'Sin seleccionar'}</b></div>)}</div><div className="recommend-total"><small>Precio estimado</small><strong>{formatTotal(total)}</strong></div><div className="ideal-for"><b>Para quién es ideal</b><p>{item.audience}</p></div><button className="button button-primary" onClick={()=>onLoad(build,item.use)}><Cpu size={15}/> Cargar y personalizar esta PC <ArrowRight size={14}/></button></article>})}{cards.length===0&&<div className="empty-state">No hay configuraciones dentro de ese filtro. Ajustá el uso o el presupuesto.</div>}</div>
  </section>
}

