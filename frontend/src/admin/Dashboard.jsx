import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [counts, setCounts] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/college-admin/api/counts/', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setCounts(d))
      .catch(() => setCounts({ student_count:'—', carousel_count:'—', gallery_count:'—', contact_count:'—' }))
  }, [])

  const cards = [
    { label:'Total Students',  value:counts?.student_count,  color:'#6c63ff', bg:'linear-gradient(135deg,#6c63ff,#a78bfa)', icon:'bi-people-fill',   path:'/portal/students', light:'#eef2ff' },
    { label:'Carousel Images', value:counts?.carousel_count, color:'#0ea5e9', bg:'linear-gradient(135deg,#0ea5e9,#38bdf8)', icon:'bi-images',        path:'/portal/carousel', light:'#e0f2fe' },
    { label:'Gallery Images',  value:counts?.gallery_count,  color:'#10b981', bg:'linear-gradient(135deg,#10b981,#34d399)', icon:'bi-image',         path:'/portal/gallery',  light:'#d1fae5' },
    { label:'Contact Messages',value:counts?.contact_count,  color:'#f59e0b', bg:'linear-gradient(135deg,#f59e0b,#fbbf24)', icon:'bi-envelope-fill', path:'/portal/contacts', light:'#fef3c7' },
  ]

  const quickActions = [
    { label:'Add Carousel',  path:'/portal/carousel', icon:'bi-plus-lg',         color:'#0ea5e9', bg:'#e0f2fe' },
    { label:'Add Gallery',   path:'/portal/gallery',  icon:'bi-image',            color:'#10b981', bg:'#d1fae5' },
    { label:'Add Student',   path:'/portal/students', icon:'bi-person-plus-fill', color:'#6c63ff', bg:'#eef2ff' },
    { label:'Messages',      path:'/portal/contacts', icon:'bi-chat-dots-fill',   color:'#f59e0b', bg:'#fef3c7' },
  ]

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom:28 }}>
        <h4 style={{ fontSize:22, fontWeight:800, color:'#1a202c', margin:0 }}>Dashboard</h4>
        <p style={{ color:'#a0aec0', fontSize:13, margin:'5px 0 0' }}>
          Welcome back! Here's an overview of University College.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {cards.map(c => (
          <div className="col-md-3 col-6" key={c.label}>
            <div onClick={() => navigate(c.path)} style={{
              borderRadius:16, overflow:'hidden', cursor:'pointer',
              boxShadow:'0 4px 20px rgba(0,0,0,.08)',
              transition:'all .25s', background:'#fff',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,.08)' }}
            >
              {/* Top gradient bar */}
              <div style={{ background:c.bg, padding:'20px 20px 16px' }}>
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
              {/* Bottom label */}
              <div style={{ padding:'12px 20px', background:'#fff' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#4a5568', textTransform:'uppercase', letterSpacing:'.6px' }}>
                  {c.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {/* Quick Actions */}
        <div className="col-lg-5">
          <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 4px 20px rgba(0,0,0,.06)', height:'100%' }}>
            <h6 style={{ fontWeight:800, color:'#1a202c', fontSize:15, marginBottom:18 }}>Quick Actions</h6>
            <div className="row g-2">
              {quickActions.map(a => (
                <div className="col-6" key={a.label}>
                  <div onClick={() => navigate(a.path)} style={{
                    padding:'16px 14px', borderRadius:13, cursor:'pointer',
                    background:a.bg, border:`1.5px solid ${a.color}22`,
                    transition:'all .2s', textAlign:'center',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 16px ${a.color}30` }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
                  >
                    <i className={`bi ${a.icon}`} style={{ fontSize:'1.4rem', color:a.color, display:'block', marginBottom:6 }}></i>
                    <div style={{ fontWeight:700, color:'#1a202c', fontSize:12 }}>{a.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* At a Glance */}
        <div className="col-lg-7">
          <div style={{
            background:'linear-gradient(135deg,#1e2a4a 0%,#16213e 60%,#0f172a 100%)',
            borderRadius:16, padding:24,
            boxShadow:'0 4px 20px rgba(0,0,0,.15)', height:'100%'
          }}>
            <h6 style={{ fontWeight:800, color:'#fff', fontSize:15, marginBottom:18 }}>
              <i className="bi bi-bar-chart-fill me-2" style={{ color:'#a78bfa' }}></i>
              At a Glance
            </h6>
            {[
              { label:'Total Students',   value:counts?.student_count  ?? '...', icon:'bi-people-fill',   color:'#a78bfa' },
              { label:'Gallery Images',   value:counts?.gallery_count  ?? '...', icon:'bi-image',         color:'#34d399' },
              { label:'Carousel Images',  value:counts?.carousel_count ?? '...', icon:'bi-images',        color:'#38bdf8' },
              { label:'Contact Messages', value:counts?.contact_count  ?? '...', icon:'bi-envelope-fill', color:'#fbbf24' },
            ].map((item, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'11px 0',
                borderBottom: i < 3 ? '1px solid rgba(255,255,255,.07)' : 'none'
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <i className={`bi ${item.icon}`} style={{ color:item.color, fontSize:'.95rem' }}></i>
                  </div>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,.7)', fontWeight:500 }}>{item.label}</span>
                </div>
                <span style={{
                  fontSize:18, color:'#fff', fontWeight:800,
                  background:'rgba(255,255,255,.08)', padding:'2px 14px',
                  borderRadius:20, minWidth:48, textAlign:'center'
                }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* College Info */}
      <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
        <h6 style={{ fontWeight:800, color:'#1a202c', fontSize:15, marginBottom:18 }}>
          <i className="bi bi-building me-2" style={{ color:'#6c63ff' }}></i>
          College Information
        </h6>
        <div className="row g-3">
          {[
            { label:'Institution',   value:'University Arts & Science College' },
            { label:'Location',      value:'Palakkad, Kerala, India' },
            { label:'Established',   value:'2011' },
            { label:'Accreditation', value:'NAAC Accredited · ISO Certified' },
            { label:'Phone',         value:'0491 2527770' },
            { label:'Email',         value:'universitycollegepkd@university.com' },
          ].map(item => (
            <div className="col-md-4 col-6" key={item.label}>
              <div style={{ background:'#f8fafc', borderRadius:12, padding:'14px 16px', border:'1px solid #e8ecf4' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#a0aec0', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:5 }}>{item.label}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'#1a202c', wordBreak:'break-all' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard