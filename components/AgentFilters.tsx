'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Props {
  sectors: string[]
  regions: string[]
  current: { sector?: string; region?: string; remote?: string }
}

export default function AgentFilters({ sectors, regions, current }: Props) {
  const router = useRouter()
  const sp = useSearchParams()
  const update = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(sp.toString())
    if (value) params.set(key, value); else params.delete(key)
    params.delete('page'); router.push(`/agents?${params}`)
  }, [router, sp])
  const clear=()=>router.push('/agents')
  const hasFilters=current.sector||current.region||current.remote
  return(
    <div style={{background:'#0f1d3a',border:'1px solid #1e3060',borderRadius:16,padding:20}}>
      <div style={{display:'flex'justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <span style={{fontWeight:700,color:'#e2e8f0'}}>Filtres</span>
        {hasFilters&&<button onClick={clear} style={{background:'none',border:'none',color:'#60a5fa',fontSize:13,cursor:'pointer'}}>Effacer</button>}
      </div>
      <div style={{marginBottom:24}}>
        <label style={{display:'flex',alignItems:'center',gap:10}}>
          <div onClick={()=>update('remote',current.remote==='1'?null:'1')} style={{width:44,height:24,borderRadius:12,position:'relative',cursor:'pointer',background:current.remote==='1'?'linear-gradient(135deg,#1e40af,#7c3aed)':'#1e3060'}}><div style={{position:'absolute',top:3,left:current.remote==='1'?22:3,width:18,height:18,borderRadius:'50%',background:"white"}}/></div>
          <span style={{color:'#94a3b8',fontSize:14}}>Remote uniquement</span>
        </label>
      </div>
      <div style={{marginBottom:24}}>
        <div style={{color:'#64748b',fontSize:12,fontWeight:600,marginBottom:10}}>SECTEUR</div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>{sectors.map(s=><button key={s} onClick={()=>update('sector',current.sector===s?null:s)} style={{textAlign:'left',padding:'8px 12px',borderRadius:8,fontSize:13,cursor:'pointer',border:'none',background:current.sector===s?'rgba(37,99,235,0.2)':'transparent',color:current.sector===s?'#60a5fa':'#94a3b8'}}>{s}</button>)}</div>
      </div>
      <div>
        <div style={{color:'#64748b',fontSize:12,fontWeight:600,marginBottom:10}}>RéGION</div>
        <select value={current.region||''} onChange={e=>update('region',e.target.value||null)} style={{width:'100%',padding:'10px 12px',background:'#080f24',border:'1px solid #1e3060',borderRadius:8,color:'#94a3b8',fontSize:13,outline:'none'}}><option value="">Toutes les régions</option>{regions.map(r=><option key={r} value={r}>{r}</option>)}</select>
      </div>
    </div>
  )
}
