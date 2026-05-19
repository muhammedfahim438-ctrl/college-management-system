import { useState, useEffect } from 'react'
import { s, Modal, Confirm, Pagination } from './adminStyles'

function getCsrf() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ''
}

function ContactsMgr() {
  const [contacts, setContacts] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [confirm, setConfirm]   = useState(null)
  const [viewMsg, setViewMsg]   = useState(null)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)

  // FIX 1: correct API URL + handle plain array from DRF
  const load = () => {
    setLoading(true)
    fetch(`/api/contacts/`, { credentials:'include' })
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : (d.contacts || [])
        setContacts(list)
        setTotal(list.length)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  // FIX 2: correct delete URL to match DRF
  const deleteContact = async id => {
    const res = await fetch(`/api/contacts/${id}/`, {
      method:'DELETE', credentials:'include', headers:{ 'X-CSRFToken':getCsrf() }
    })
    if (res.ok) load(); else alert('Delete failed.')
    setConfirm(null)
  }

  const exportCSV = () => {
    const headers = ['#','Name','Email','Subject','Message','Date']
    const rows = contacts.map((c,i) => [i+1,c.name,c.email,c.subject||'',c.message||'',c.created_at||''])
    const csv = [headers,...rows].map(r => r.map(c => `"${(c||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,'+encodeURIComponent(csv)
    a.download = 'contacts.csv'; a.click()
  }

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    return !q || (c.name+c.email+(c.subject||'')).toLowerCase().includes(q)
  })

  // Client-side pagination slice
  const perPage = 10
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const msgModalContent = viewMsg && (
    <>
      {/* Sender info */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, padding:'14px', background:'#f8fafc', borderRadius:14, border:'1px solid #e8ecf4' }}>
        <div style={{ width:46, height:46, borderRadius:13, background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:18, flexShrink:0 }}>
          {viewMsg.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:15 }}>{viewMsg.name}</div>
          <div style={{ fontSize:12, color:'#64748b', marginTop:1 }}>{viewMsg.email}</div>
        </div>
      </div>

      {/* Details */}
      {[
        { label:'Subject', value:viewMsg.subject||'—' },
        { label:'Date',    value:viewMsg.created_at||'—' },
      ].map(item => (
        <div key={item.label} style={{ marginBottom:12, padding:'10px 14px', background:'#f8fafc', borderRadius:12, border:'1px solid #e8ecf4' }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:3 }}>{item.label}</div>
          <div style={{ fontSize:14, color:'#1e1b4b', fontWeight:600 }}>{item.value}</div>
        </div>
      ))}

      {/* FIX 3: message wraps properly — no overflow */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:8 }}>Message</div>
        <div style={{
          background:'#f8fafc', border:'1.5px solid #e8ecf4', borderRadius:14,
          padding:'16px', fontSize:14, color:'#1e1b4b', lineHeight:1.8,
          whiteSpace:'pre-wrap',
          wordBreak:'break-word',
          overflowWrap:'break-word',
          overflowX:'hidden',
        }}>
          {viewMsg.message}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:10 }}>
        <a href={`mailto:${viewMsg.email}?subject=Re: ${encodeURIComponent(viewMsg.subject||'Your enquiry')}&body=Dear ${encodeURIComponent(viewMsg.name)},%0D%0A%0D%0A`}
          style={{ flex:2, padding:13, borderRadius:12, background:'linear-gradient(135deg,#6366f1,#a78bfa)', color:'#fff', textAlign:'center', textDecoration:'none', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 12px rgba(99,102,241,.3)' }}
        >
          <i className="bi bi-reply-fill"></i> Reply via Email
        </a>
        <button onClick={() => { setViewMsg(null); setConfirm(viewMsg.id) }}
          style={{ flex:1, padding:13, borderRadius:12, background:'#fff5f5', color:'#dc2626', border:'1.5px solid #fed7d7', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
        >
          <i className="bi bi-trash-fill"></i> Delete
        </button>
      </div>
    </>
  )

  return (
    <div>
      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <h4 style={s.pageTitle}>Contact Messages</h4>
          <p style={s.pageSubtitle}>Messages from the website contact form</p>
        </div>
        <button onClick={exportCSV} style={s.csvBtn}>
          <i className="bi bi-download me-1"></i>CSV
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom:16 }}>
        <div style={s.searchWrap}>
          <i className="bi bi-search" style={s.searchIcon}></i>
          <input type="text" placeholder="Search name, email, subject..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{ ...s.searchInput, borderRadius:12 }} />
        </div>
      </div>

      {/* Count badge */}
      <div style={{ fontSize:12, fontWeight:700, color:'#6366f1', background:'#eef2ff', padding:'5px 12px', borderRadius:20, display:'inline-block', marginBottom:16 }}>
        {filtered.length} messages total
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="mgr-desktop">
        <div style={s.card}>
          <div style={{ overflowX:'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>{['#','Name','Email','Subject','Message','Date','Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={s.emptyTd}><i className="bi bi-hourglass-split me-2"></i>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" style={s.emptyTd}>
                    <i className="bi bi-envelope" style={{ fontSize:'2rem', color:'#e2e8f4', display:'block', margin:'0 auto 8px' }}></i>
                    No messages found.
                  </td></tr>
                ) : paged.map((c, i) => {
                  const niceDate = c.created_at
                    ? new Date(c.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
                    : '—'
                  return (
                  <tr key={c.id} style={s.tr}
                    onMouseEnter={e => e.currentTarget.style.background='#fafbff'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <td style={s.td}><span style={s.indexBadge}>{(page-1)*perPage+i+1}</span></td>
                    <td style={s.td}><strong style={{ color:'#1e1b4b' }}>{c.name}</strong></td>
                    <td style={s.td}><span style={{ color:'#64748b' }}>{c.email}</span></td>
                    <td style={s.td}>{c.subject||'—'}</td>
                    <td style={s.td}>
                      <span style={{ maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'inline-block', color:'#64748b', fontSize:13 }}>{c.message}</span>
                    </td>
                    <td style={{ ...s.td, fontSize:12, color:'#64748b', whiteSpace:'nowrap' }}>{niceDate}</td>
                    <td style={s.td}>
                      <div style={s.actionBtns}>
                        <button onClick={() => setViewMsg(c)} style={s.viewBtn}><i className="bi bi-eye-fill me-1"></i>View</button>
                        <button onClick={() => setConfirm(c.id)} style={s.delBtn}><i className="bi bi-trash-fill me-1"></i>Delete</button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* FIX 4: correct Pagination props */}
          <Pagination total={total} perPage={10} page={page} setPage={setPage} />
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="mgr-mobile">
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>
            <i className="bi bi-hourglass-split me-2"></i>Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>No messages found.</div>
        ) : (
          <>
            {filtered.map((c) => {
              // FIX 1: format ISO date to readable string
              const niceDate = c.created_at
                ? new Date(c.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
                : '—'
              const niceTime = c.created_at
                ? new Date(c.created_at).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
                : ''

              return (
              <div key={c.id} style={{ background:'#fff', borderRadius:16, padding:16, marginBottom:12, boxShadow:'0 4px 16px rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.06)' }}>

                {/* Top row */}
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16, flexShrink:0 }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize:11, color:'#64748b', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.email}</div>
                  </div>
                </div>

                {/* Details grid — FIX 1: show clean date */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px' }}>Subject</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#1e1b4b', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.subject||'—'}</div>
                  </div>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px' }}>Date</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#1e1b4b', marginTop:2 }}>{niceDate}</div>
                    <div style={{ fontSize:10, color:'#94a3b8', marginTop:1 }}>{niceTime}</div>
                  </div>
                </div>

                {/* FIX 2: message wraps, max 3 lines preview */}
                <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px', marginBottom:12 }}>
                  <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px', marginBottom:3 }}>Message</div>
                  <div style={{ fontSize:12, color:'#64748b', wordBreak:'break-word', overflowWrap:'break-word', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.5 }}>
                    {c.message}
                  </div>
                </div>

                {/* FIX 3: equal buttons, proper size */}
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setViewMsg(c)} style={{ ...s.viewBtn, flex:1, justifyContent:'center', padding:'10px 8px', display:'flex', alignItems:'center', gap:5, fontSize:12, borderRadius:10 }}>
                    <i className="bi bi-eye-fill"></i> View
                  </button>
                  <button onClick={() => setConfirm(c.id)} style={{ ...s.delBtn, flex:1, justifyContent:'center', padding:'10px 8px', display:'flex', alignItems:'center', gap:5, fontSize:12, borderRadius:10 }}>
                    <i className="bi bi-trash-fill"></i> Delete
                  </button>
                </div>
              </div>
              )
            })}
            {/* FIX 4: correct Pagination props */}
            <Pagination total={total} perPage={10} page={page} setPage={setPage} />
          </>
        )}
      </div>

      {viewMsg && (
        <Modal title="Message Details" onClose={() => setViewMsg(null)}>
          {msgModalContent}
        </Modal>
      )}

      {confirm && (
        <Confirm
          onCancel={() => setConfirm(null)}
          onConfirm={() => deleteContact(confirm)}
          msg="This message will be permanently deleted."
        />
      )}

      <style>{`
        @media(min-width:769px){ .mgr-mobile{ display:none } .mgr-desktop{ display:block } }
        @media(max-width:768px){ .mgr-desktop{ display:none } .mgr-mobile{ display:block } }
      `}</style>
    </div>
  )
}

export default ContactsMgr