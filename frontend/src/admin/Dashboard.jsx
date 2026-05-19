import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [counts, setCounts] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/college-admin/api/counts/', { credentials:'include' })
      .then(r => r.json())
      .then(d => setCounts(d))
      .catch(() => setCounts({ student_count:'—', carousel_count:'—', gallery_count:'—', contact_count:'—' }))
  }, [])

  const cards = [
    { label:'Total Students',   value:counts?.student_count,  grad:'linear-gradient(135deg,#6366f1,#a78bfa)', icon:'bi-people-fill',   path:'/portal/students', light:'#eef2ff', color:'#6366f1' },
    { label:'Carousel Images',  value:counts?.carousel_count, grad:'linear-gradient(135deg,#0ea5e9,#38bdf8)', icon:'bi-images',        path:'/portal/carousel', light:'#e0f2fe', color:'#0ea5e9' },
    { label:'Gallery Images',   value:counts?.gallery_count,  grad:'linear-gradient(135deg,#10b981,#34d399)', icon:'bi-image',         path:'/portal/gallery',  light:'#d1fae5', color:'#10b981' },
    { label:'Contact Messages', value:counts?.contact_count,  grad:'linear-gradient(135deg,#f59e0b,#fbbf24)', icon:'bi-envelope-fill', path:'/portal/contacts', light:'#fef3c7', color:'#f59e0b' },
  ]

  const actions = [
    { label:'Add Carousel', path:'/portal/carousel', icon:'bi-plus-circle-fill', color:'#0ea5e9', bg:'#e0f2fe' },
    { label:'Add Gallery',  path:'/portal/gallery',  icon:'bi-image',            color:'#10b981', bg:'#d1fae5' },
    { label:'Add Student',  path:'/portal/students', icon:'bi-person-plus-fill', color:'#6366f1', bg:'#eef2ff' },
    { label:'Messages',     path:'/portal/contacts', icon:'bi-chat-dots-fill',   color:'#f59e0b', bg:'#fef3c7' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:24 }} className="dash-header">
        <h4 style={{ fontSize:22, fontWeight:800, color:'#1e1b4b', margin:0 }}>Dashboard</h4>
        <p style={{ color:'#94a3b8', fontSize:13, margin:'4px 0 0' }}>Welcome back! Here's your overview.</p>
      </div>

      {/* ── DESKTOP ── */}
      <div className="dash-desktop">
        <div className="row g-3 mb-4">
          {cards.map(c => (
            // FIX: use c.label (string) as key — never use index or object
            <div className="col-md-3 col-6" key={c.label}>
              <div onClick={() => navigate(c.path)} style={{
                borderRadius:16, overflow:'hidden', cursor:'pointer',
                boxShadow:'0 4px 20px rgba(0,0,0,.08)', transition:'all .25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,.14)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,.08)' }}
              >
                <div style={{ background:c.grad, padding:'20px 20px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ width:46, height:46, borderRadius:13, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <i className={`bi ${c.icon}`} style={{ fontSize:'1.3rem', color:'#fff' }}></i>
                    </div>
                    <i className="bi bi-arrow-up-right-circle-fill" style={{ color:'rgba(255,255,255,.5)', fontSize:'1.1rem' }}></i>
                  </div>
                  <div style={{ fontSize:32, fontWeight:800, color:'#fff', marginTop:12, lineHeight:1 }}>
                    {counts ? c.value : '...'}
                  </div>
                </div>
                <div style={{ padding:'12px 20px', background:'#fff' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.6px' }}>{c.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions + Glance */}
        <div className="row g-3 mb-4">
          <div className="col-lg-5">
            <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 4px 20px rgba(99,102,241,.06)', height:'100%' }}>
              <h6 style={{ fontWeight:800, color:'#1e1b4b', fontSize:15, marginBottom:18 }}>Quick Actions</h6>
              <div className="row g-2">
                {actions.map(a => (
                  // FIX: use a.label (string) as key
                  <div className="col-6" key={a.label}>
                    <div onClick={() => navigate(a.path)} style={{ padding:'16px 14px', borderRadius:13, cursor:'pointer', background:a.bg, textAlign:'center', transition:'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 16px ${a.color}30` }}
                      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                    >
                      <i className={`bi ${a.icon}`} style={{ fontSize:'1.4rem', color:a.color, display:'block', marginBottom:6 }}></i>
                      <div style={{ fontWeight:700, color:'#1e1b4b', fontSize:12 }}>{a.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius:16, padding:24, boxShadow:'0 4px 20px rgba(99,102,241,.2)', height:'100%' }}>
              <h6 style={{ fontWeight:800, color:'#fff', fontSize:15, marginBottom:18 }}>
                <i className="bi bi-bar-chart-fill me-2" style={{ color:'#a78bfa' }}></i>At a Glance
              </h6>
              {cards.map((c, i) => (
                // FIX: use c.label (string) as key — not index i
                <div key={c.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,.07)' : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <i className={`bi ${c.icon}`} style={{ color:c.color, fontSize:'.9rem' }}></i>
                    </div>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,.75)', fontWeight:500 }}>{c.label}</span>
                  </div>
                  <span style={{ fontSize:18, color:'#fff', fontWeight:800, background:'rgba(255,255,255,.08)', padding:'2px 14px', borderRadius:20 }}>{counts ? c.value : '...'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="dash-mobile">
        <div style={{ background:'linear-gradient(135deg,#6366f1,#a78bfa)', borderRadius:20, padding:'20px', marginBottom:16, boxShadow:'0 8px 24px rgba(99,102,241,.3)' }}>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.75)', fontWeight:500, marginBottom:4 }}>Welcome back 👋</div>
          <div style={{ fontSize:20, fontWeight:800, color:'#fff' }}>College Dashboard</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', marginTop:4 }}>Here's what's happening today</div>
        </div>

        {/* FIX: use c.label as key — not index i */}
        {cards.map(c => (
          <div key={c.label} onClick={() => navigate(c.path)} style={{
            background:'#fff', borderRadius:16, padding:'16px 18px', marginBottom:12,
            boxShadow:'0 4px 16px rgba(99,102,241,.08)',
            border:'1px solid rgba(99,102,241,.06)',
            display:'flex', alignItems:'center', gap:16, cursor:'pointer',
            transition:'all .2s',
          }}>
            <div style={{ width:52, height:52, borderRadius:14, background:c.grad, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 12px ${c.color}40` }}>
              <i className={`bi ${c.icon}`} style={{ fontSize:'1.3rem', color:'#fff' }}></i>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:2 }}>{c.label}</div>
              <div style={{ fontSize:28, fontWeight:800, color:'#1e1b4b', lineHeight:1 }}>{counts ? c.value : '...'}</div>
            </div>
            <i className="bi bi-chevron-right" style={{ color:'#c7d2fe', fontSize:'1rem' }}></i>
          </div>
        ))}

        {/* FIX: use a.label as key — not index i */}
        <div style={{ background:'#fff', borderRadius:16, padding:'16px', marginBottom:12, boxShadow:'0 4px 16px rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.06)' }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#1e1b4b', marginBottom:14 }}>Quick Actions</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {actions.map(a => (
              <div key={a.label} onClick={() => navigate(a.path)} style={{
                padding:'14px 12px', borderRadius:12, cursor:'pointer',
                background:a.bg, textAlign:'center', transition:'all .2s',
              }}>
                <i className={`bi ${a.icon}`} style={{ fontSize:'1.3rem', color:a.color, display:'block', marginBottom:6 }}></i>
                <div style={{ fontWeight:700, color:'#1e1b4b', fontSize:11 }}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width:769px){ .dash-mobile{ display:none } .dash-desktop{ display:block } }
        @media(max-width:768px){ .dash-desktop{ display:none } .dash-mobile{ display:block } .dash-header h4{ font-size:18px } }
      `}</style>
    </div>
  )
}

export default Dashboard