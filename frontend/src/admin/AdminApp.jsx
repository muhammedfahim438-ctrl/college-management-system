import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'

import Dashboard   from './Dashboard'
import CarouselMgr from './CarouselMgr'
import GalleryMgr  from './GalleryMgr'
import StudentsMgr from './StudentsMgr'
import ContactsMgr from './ContactsMgr'

const navItems = [
  { path: '/portal/dashboard', icon: 'bi-speedometer2',  label: 'Dashboard' },
  { path: '/portal/carousel',  icon: 'bi-images',        label: 'Carousel'  },
  { path: '/portal/gallery',   icon: 'bi-image',         label: 'Gallery'   },
  { path: '/portal/students',  icon: 'bi-people-fill',   label: 'Students'  },
  { path: '/portal/contacts',  icon: 'bi-envelope-fill', label: 'Contacts'  },
]

function AdminApp() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sideOpen, setSideOpen] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken')
    if (!token) navigate('/portal/login')
  }, [])

  const logout = () => {
    sessionStorage.removeItem('adminToken')
    navigate('/portal/login')
  }

  // Breadcrumb label
  const currentNav = navItems.find(n => location.pathname.startsWith(n.path))
  const pageLabel  = currentNav?.label || 'Dashboard'

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f0f2f5', fontFamily:"'Segoe UI',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260, background: '#fff',
        borderRight: '1px solid #e8ecf0',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0,
        height: '100vh', zIndex: 1000,
        transition: 'left .3s',
        boxShadow: '2px 0 8px rgba(0,0,0,.06)'
      }}>
        {/* Brand */}
        <div style={{ padding:'22px 20px 16px', borderBottom:'1px solid #f0f2f5' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:40, height:40, borderRadius:10,
              background:'linear-gradient(135deg,#6366f1,#4f46e5)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem'
            }}>🎓</div>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:'#1a202c' }}>College Admin</div>
              <div style={{ fontSize:11, color:'#a0aec0', marginTop:1 }}>Management Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'16px 12px', overflowY:'auto' }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#a0aec0', letterSpacing:1, textTransform:'uppercase', padding:'0 10px 8px' }}>
            Main Menu
          </div>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSideOpen(false)}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:12,
                padding:'10px 14px', borderRadius:10, marginBottom:2,
                textDecoration:'none', fontWeight:600, fontSize:14,
                color: isActive ? '#6366f1' : '#4a5568',
                background: isActive ? '#eef2ff' : 'transparent',
                transition:'all .2s',
              })}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize:'1.1rem' }}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:'12px', borderTop:'1px solid #f0f2f5' }}>
          <button onClick={logout} style={{
            width:'100%', padding:'10px 14px', borderRadius:10,
            background:'#fff5f5', border:'1px solid #fed7d7',
            color:'#e53e3e', fontWeight:600, fontSize:13,
            cursor:'pointer', display:'flex', alignItems:'center', gap:10
          }}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
          <a href="/" style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 14px', marginTop:6, borderRadius:10,
            color:'#a0aec0', fontSize:13, textDecoration:'none'
          }}>
            <i className="bi bi-globe"></i> View Website
          </a>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, marginLeft:260, display:'flex', flexDirection:'column' }}
        className="admin-main">

        {/* Top Bar */}
        <header style={{
          background:'#fff', borderBottom:'1px solid #e8ecf0',
          padding:'12px 24px', display:'flex', alignItems:'center',
          justifyContent:'space-between', position:'sticky', top:0, zIndex:100,
          boxShadow:'0 1px 4px rgba(0,0,0,.05)'
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Mobile menu btn */}
            <button
              onClick={() => setSideOpen(!sideOpen)}
              className="admin-menu-btn"
              style={{ background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'#4a5568', display:'none' }}
            >
              <i className="bi bi-list"></i>
            </button>

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              style={{
                display:'flex', alignItems:'center', gap:6,
                background:'#f7fafc', border:'1px solid #e2e8f0',
                borderRadius:8, padding:'6px 12px',
                color:'#4a5568', fontSize:13, fontWeight:600, cursor:'pointer'
              }}
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>

            {/* Breadcrumb */}
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#a0aec0' }}>
              <a href="/portal/dashboard" style={{ color:'#a0aec0', textDecoration:'none' }}>Home</a>
              <i className="bi bi-chevron-right" style={{ fontSize:10 }}></i>
              <span style={{ color:'#1a202c', fontWeight:600 }}>{pageLabel}</span>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <a href="/" target="_blank" style={{
              display:'flex', alignItems:'center', gap:6,
              background:'#eef2ff', color:'#6366f1',
              border:'1px solid #c7d2fe', borderRadius:8,
              padding:'6px 12px', fontSize:13, fontWeight:600,
              textDecoration:'none'
            }}>
              <i className="bi bi-globe"></i> Website
            </a>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:34, height:34, borderRadius:'50%',
                background:'linear-gradient(135deg,#6366f1,#4f46e5)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontWeight:700, fontSize:13
              }}>A</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1a202c', lineHeight:1.2 }}>
                  {sessionStorage.getItem('adminUsername') || 'Admin'}
                </div>
                <div style={{ fontSize:11, color:'#a0aec0' }}>Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex:1, padding:24, overflowY:'auto' }}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="carousel"  element={<CarouselMgr />} />
            <Route path="gallery"   element={<GalleryMgr />} />
            <Route path="students"  element={<StudentsMgr />} />
            <Route path="contacts"  element={<ContactsMgr />} />
            <Route path="*"         element={<Dashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{ padding:'14px 24px', borderTop:'1px solid #e8ecf0', background:'#fff', textAlign:'center' }}>
          <span style={{ fontSize:12, color:'#a0aec0' }}>
            © 2026 University Arts & Science College · College Admin Portal
          </span>
        </footer>
      </div>

      {/* Mobile overlay */}
      {sideOpen && (
        <div onClick={() => setSideOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,.3)', zIndex:999
        }} />
      )}

      <style>{`
        @media(min-width:769px){
          .admin-sidebar{ left: 0 !important }
          .admin-main{ margin-left: 260px !important }
        }
        @media(max-width:768px){
          .admin-sidebar{ left: ${sideOpen ? '0' : '-260px'} !important }
          .admin-main{ margin-left: 0 !important }
          .admin-menu-btn{ display: flex !important }
        }
      `}</style>
    </div>
  )
}

export default AdminApp