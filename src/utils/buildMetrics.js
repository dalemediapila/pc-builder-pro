import { categories } from '../data/components.js'
import { evaluateCompatibility, estimateBottleneck } from './compatibilityEngine.js'

export const scoreBuild=build=>{
  const cpu=build?.cpu?.score||0,gpu=build?.gpu?.score||0
  return {gaming:Math.round(cpu*.3+gpu*.7),productivity:Math.round(cpu*.65+gpu*.35)}
}
export const buildTotal=(build,priceOf=(key,item)=>item?.price||0)=>categories.reduce((sum,[key])=>sum+(build?.[key]?priceOf(key,build[key]):0),0)
export const buildMetrics=(build,use='Gaming 1440p')=>({
  ...scoreBuild(build||{}),
  bottleneck:estimateBottleneck(build?.cpu,build?.gpu,use),
  power:evaluateCompatibility(build||{}).draw,
})
export const componentQuality=(key,item)=>{
  if(!item)return 0
  if(key==='cpu'||key==='gpu')return item.score||0
  if(key==='ram')return item.capacity||0
  if(key==='storage')return item.capacity||0
  if(key==='psu')return item.watts||0
  if(key==='cooler')return item.maxTdp||0
  if(key==='motherboard')return item.m2||0
  if(key==='case')return item.maxGpuLength||0
  return 0
}
