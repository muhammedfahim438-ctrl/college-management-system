import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'

import Dashboard   from './Dashboard'
import CarouselMgr from './CarouselMgr'
import GalleryMgr  from './GalleryMgr'
import StudentsMgr from './StudentsMgr'
import ContactsMgr from './ContactsMgr'

const navItems = [
  { path:'/portal/dashboard', icon:'bi-grid-fill',     label:'Dashboard' },
  { path:'/portal/carousel',  icon:'bi-images',        label:'Carousel'  },
  { path:'/portal/gallery',   icon:'bi-image',         label:'Gallery'   },
  { path:'/portal/students',  icon:'bi-people-fill',   label:'Students'  },
  { path:'/portal/contacts',  icon:'bi-envelope-fill', label:'Contacts'  },
]

export default function AdminApp() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sideOpen, setSideOpen] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('adminToken')) navigate('/portal/login')
  }, [])

  const logout = () => {
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminUsername')
    navigate('/portal/login', { replace: true })
  }

  const goBack = () => {
    // If on dashboard → logout and go to login
    // If on other page → go back to dashboard
    if (location.pathname === '/portal/dashboard') {
      sessionStorage.removeItem('adminToken')
      sessionStorage.removeItem('adminUsername')
      navigate('/portal/login', { replace: true })
    } else {
      navigate('/portal/dashboard')
    }
  }

  const currentNav = navItems.find(n => location.pathname.startsWith(n.path))
  const pageLabel  = currentNav?.label || 'Dashboard'
  const username   = sessionStorage.getItem('adminUsername') || 'Admin'

  return (
    <div style={{
      display:'flex', minHeight:'100vh',
      background:'linear-gradient(135deg,#f0f4ff 0%,#f8f0ff 50%,#fff0f8 100%)',
      fontFamily:"'Segoe UI',sans-serif",
    }}>

      {/* ── Background blobs (desktop only) ── */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(99,102,241,.08)', top:-100, left:-100, filter:'blur(80px)' }}></div>
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(236,72,153,.06)', top:'40%', right:-80, filter:'blur(80px)' }}></div>
      </div>

      {/* ══════════ DESKTOP SIDEBAR ══════════ */}
      <aside className="admin-sidebar" style={{
        width:260, position:'fixed', top:0, left:0,
        height:'100vh', zIndex:200,
        background:'rgba(255,255,255,.85)',
        backdropFilter:'blur(20px)',
        borderRight:'1px solid rgba(99,102,241,.1)',
        boxShadow:'4px 0 24px rgba(99,102,241,.08)',
        display:'flex', flexDirection:'column',
      }}>
        {/* Brand */}
        <div style={{ padding:'24px 20px 18px', borderBottom:'1px solid rgba(99,102,241,.08)', background:'linear-gradient(135deg,rgba(99,102,241,.06),rgba(167,139,250,.04))' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:46, height:46, borderRadius:14, background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', boxShadow:'0 4px 14px rgba(99,102,241,.35)' }}>🎓</div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:'#1e1b4b' }}>College Admin</div>
              <div style={{ fontSize:11, color:'#8b87c4', marginTop:1, fontWeight:500 }}>Management Portal</div>
            </div>
          </div>
        </div>
        {/* Nav label */}
        <div style={{ padding:'18px 22px 6px' }}>
          <span style={{ fontSize:10, fontWeight:800, color:'#a5b4fc', letterSpacing:1.5, textTransform:'uppercase' }}>Main Menu</span>
        </div>
        {/* Nav Links */}
        <nav style={{ flex:1, padding:'4px 12px', overflowY:'auto' }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:12,
                padding:'11px 14px', borderRadius:14, marginBottom:4,
                textDecoration:'none', fontWeight:700, fontSize:14,
                color: isActive ? '#6366f1' : '#64748b',
                background: isActive ? 'linear-gradient(135deg,rgba(99,102,241,.12),rgba(167,139,250,.08))' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,.18)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 12px rgba(99,102,241,.1)' : 'none',
                transition:'all .2s',
              })}
            >
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>
                <i className={`bi ${item.icon}`}></i>
              </div>
              {item.label}
            </NavLink>
          ))}
        </nav>
        {/* Bottom */}
        <div style={{ margin:'0 16px', borderTop:'1px solid rgba(99,102,241,.08)' }}></div>
        <div style={{ padding:'14px 16px 24px', display:'flex', flexDirection:'column', gap:10 }}>
          <a href="/" target="_blank" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', borderRadius:12, background:'rgba(16,185,129,.08)', border:'1.5px solid rgba(16,185,129,.2)', color:'#059669', textDecoration:'none', fontSize:13, fontWeight:700, transition:'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,#10b981,#059669)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(16,185,129,.08)'; e.currentTarget.style.color='#059669' }}
          ><i className="bi bi-globe2"></i> View Website</a>
          <button onClick={logout} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', borderRadius:12, width:'100%', background:'rgba(239,68,68,.08)', border:'1.5px solid rgba(239,68,68,.18)', color:'#dc2626', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,#ef4444,#dc2626)'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,.08)'; e.currentTarget.style.color='#dc2626' }}
          ><i className="bi bi-box-arrow-right"></i> Logout</button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="admin-main" style={{ flex:1, marginLeft:260, display:'flex', flexDirection:'column', minHeight:'100vh', position:'relative', zIndex:1 }}>

        {/* ── DESKTOP TOPBAR ── */}
        <header className="admin-topbar" style={{
          background:'rgba(255,255,255,.8)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(99,102,241,.08)',
          padding:'0 28px', height:68,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          position:'sticky', top:0, zIndex:100,
          boxShadow:'0 2px 16px rgba(99,102,241,.06)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={goBack} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(99,102,241,.08)', border:'1.5px solid rgba(99,102,241,.18)', borderRadius:10, padding:'7px 14px', color:'#6366f1', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,#6366f1,#a78bfa)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(99,102,241,.08)'; e.currentTarget.style.color='#6366f1' }}
            ><i className="bi bi-arrow-left"></i> Back</button>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              <a href="/portal/dashboard" style={{ color:'#a5b4fc', textDecoration:'none', fontWeight:600 }}><i className="bi bi-house-fill"></i></a>
              <i className="bi bi-chevron-right" style={{ fontSize:10, color:'#c7d2fe' }}></i>
              <span style={{ color:'#1e1b4b', fontWeight:800 }}>{pageLabel}</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <a href="/" target="_blank" style={{ display:'flex', alignItems:'center', gap:6, background:'linear-gradient(135deg,#6366f1,#a78bfa)', color:'#fff', borderRadius:10, padding:'7px 16px', fontSize:13, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 12px rgba(99,102,241,.3)' }}>
              <i className="bi bi-globe2"></i> Website
            </a>
            <div style={{ width:1, height:32, background:'rgba(99,102,241,.12)' }}></div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16, boxShadow:'0 4px 12px rgba(99,102,241,.25)' }}>
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:'#1e1b4b', lineHeight:1.2 }}>{username}</div>
                <div style={{ fontSize:11, color:'#8b87c4' }}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── MOBILE TOPBAR ── */}
        <header className="admin-mob-topbar" style={{
          display:'none', background:'rgba(255,255,255,.95)',
          backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(99,102,241,.08)',
          padding:'0 16px', height:56,
          alignItems:'center', justifyContent:'space-between',
          position:'sticky', top:0, zIndex:100,
          boxShadow:'0 2px 12px rgba(99,102,241,.08)',
        }}>
          <button onClick={goBack} style={{ width:36, height:36, borderRadius:10, background:'rgba(99,102,241,.08)', border:'1.5px solid rgba(99,102,241,.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#6366f1', fontSize:'1rem', cursor:'pointer' }}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem' }}>🎓</div>
            <span style={{ fontWeight:800, fontSize:15, color:'#1e1b4b' }}>{pageLabel}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <a href="/" style={{ width:36, height:36, borderRadius:10, background:'rgba(16,185,129,.1)', border:'1.5px solid rgba(16,185,129,.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#059669', textDecoration:'none', fontSize:'.95rem' }}>
              <i className="bi bi-globe2"></i>
            </a>
            <button onClick={logout} style={{ width:36, height:36, borderRadius:10, background:'rgba(239,68,68,.08)', border:'1.5px solid rgba(239,68,68,.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#dc2626', cursor:'pointer', fontSize:'.95rem' }}>
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex:1, padding:28, overflowY:'auto', paddingBottom:90 }}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="carousel"  element={<CarouselMgr />} />
            <Route path="gallery"   element={<GalleryMgr />} />
            <Route path="students"  element={<StudentsMgr />} />
            <Route path="contacts"  element={<ContactsMgr />} />
            <Route path="*"         element={<Dashboard />} />
          </Routes>
        </main>

        {/* Desktop Footer */}
        <footer className="admin-footer" style={{ padding:'14px 28px', background:'rgba(255,255,255,.6)', backdropFilter:'blur(12px)', borderTop:'1px solid rgba(99,102,241,.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>© 2026 University Arts & Science College</span>
          <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>College Admin Portal v1.0</span>
        </footer>

        {/* ══ MOBILE BOTTOM TAB BAR ══ */}
        <nav className="admin-bottom-nav" style={{
          display:'none', position:'fixed', bottom:0, left:0, right:0, zIndex:200,
          background:'rgba(255,255,255,.95)', backdropFilter:'blur(20px)',
          borderTop:'1px solid rgba(99,102,241,.1)',
          boxShadow:'0 -4px 24px rgba(99,102,241,.1)',
          padding:'6px 0 8px',
        }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path}
              style={({ isActive }) => ({
                flex:1, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                gap:3, textDecoration:'none', padding:'4px 0',
                color: isActive ? '#6366f1' : '#94a3b8',
                transition:'all .2s', minHeight:44,
              })}
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    width:40, height:32, borderRadius:10,
                    background: isActive ? 'linear-gradient(135deg,rgba(99,102,241,.15),rgba(167,139,250,.1))' : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all .2s',
                  }}>
                    <i className={`bi ${item.icon}`} style={{ fontSize:'1.1rem' }}></i>
                  </div>
                  <span style={{ fontSize:9, fontWeight: isActive ? 800 : 600, letterSpacing:.3 }}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <style>{`
        @media(min-width:769px){
          .admin-sidebar{ display: flex !important }
          .admin-main{ margin-left: 260px !important }
          .admin-topbar{ display: flex !important }
          .admin-mob-topbar{ display: none !important }
          .admin-bottom-nav{ display: none !important }
          .admin-footer{ display: flex !important }
        }
        @media(max-width:768px){
          .admin-sidebar{ display: none !important }
          .admin-main{ margin-left: 0 !important }
          .admin-topbar{ display: none !important }
          .admin-mob-topbar{ display: flex !important }
          .admin-bottom-nav{ display: flex !important }
          .admin-footer{ display: none !important }
          main{ padding: 14px 14px 100px !important }
        }
      `}</style>
    </div>
  )
}