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
  const perPage = 10

  const load = () => {
    setLoading(true)
    fetch('/college-admin/api/contacts/', { credentials:'include' })
      .then(r => r.json())
      .then(d => { setContacts(d.contacts||[]); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const deleteContact = async id => {
    const res = await fetch(`/college-admin/api/contacts/delete/${id}/`, {
      method:'POST', credentials:'include', headers:{ 'X-CSRFToken':getCsrf() }
    })
    const d = await res.json()
    if (d.success) load(); else alert(d.error||'Failed.')
    setConfirm(null)
  }

  const exportCSV = () => {
    const headers = ['#','Name','Email','Subject','Message','Date']
    const rows = contacts.map((c,i) => [i+1,c.name,c.email,c.subject||'',c.message||'',c.created_at||''])
    const csv = [headers,...rows].map(r => r.map(c => `"${(c||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='contacts.csv'; a.click()
  }

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    return !q||(c.name+c.email+(c.subject||'')).toLowerCase().includes(q)
  })
  const paged = filtered.slice((page-1)*perPage, page*perPage)

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h4 style={s.pageTitle}>Contact Messages</h4>
          <p style={s.pageSubtitle}>Messages from the website contact form</p>
        </div>
        <button onClick={exportCSV} style={s.csvBtn}><i className="bi bi-download me-1"></i>Export CSV</button>
      </div>

      <div style={s.card}>
        <div style={s.toolbar}>
          <div style={s.searchWrap}>
            <i className="bi bi-search" style={s.searchIcon}></i>
            <input type="text" placeholder="Search name, email, subject..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }} style={s.searchInput} />
          </div>
          <span style={s.countBadge}>{filtered.length} messages</span>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>{['#','Name','Email','Subject','Message','Date','Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={s.emptyTd}><i className="bi bi-hourglass-split me-2"></i>Loading...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan="7" style={s.emptyTd}>
                  <i className="bi bi-envelope" style={{ fontSize:'2rem', color:'#e2e8f0', display:'block', margin:'0 auto 8px' }}></i>
                  No messages found.
                </td></tr>
              ) : paged.map((c, i) => (
                <tr key={c.id} style={s.tr}
                  onMouseEnter={e => e.currentTarget.style.background='#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <td style={s.td}><span style={s.indexBadge}>{(page-1)*perPage+i+1}</span></td>
                  <td style={s.td}><strong style={{ color:'#1a202c' }}>{c.name}</strong></td>
                  <td style={s.td}><span style={{ color:'#718096' }}>{c.email}</span></td>
                  <td style={s.td}>{c.subject||'—'}</td>
                  <td style={s.td}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ maxWidth:140, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'inline-block', color:'#718096', fontSize:13 }}>
                        {c.message}
                      </span>
                      <button onClick={() => setViewMsg(c)} style={s.viewBtn}>
                        <i className="bi bi-eye-fill me-1"></i>View
                      </button>
                    </div>
                  </td>
                  <td style={{ ...s.td, fontSize:12, whiteSpace:'nowrap', color:'#718096' }}>{c.created_at||'—'}</td>
                  <td style={s.td}>
                    <button onClick={() => setConfirm(c.id)} style={s.delBtn}><i className="bi bi-trash-fill me-1"></i>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination total={filtered.length} perPage={perPage} page={page} setPage={setPage} />
      </div>

      {/* View Message Modal */}
      {viewMsg && (
        <Modal title={`Message from ${viewMsg.name}`} onClose={() => setViewMsg(null)}>
          {[
            { label:'Name',    value:viewMsg.name },
            { label:'Email',   value:viewMsg.email },
            { label:'Subject', value:viewMsg.subject||'—' },
            { label:'Date',    value:viewMsg.created_at||'—' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom:14, padding:'10px 14px', background:'#f8fafc', borderRadius:10, border:'1px solid #e8ecf4' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#a0aec0', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:3 }}>{item.label}</div>
              <div style={{ fontSize:14, color:'#1a202c', fontWeight:600 }}>{item.value}</div>
            </div>
          ))}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#a0aec0', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:8 }}>Message</div>
            <div style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:12, padding:'14px 16px', fontSize:14, color:'#2d3748', lineHeight:1.8 }}>
              {viewMsg.message}
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <a href={`mailto:${viewMsg.email}?subject=Re: ${viewMsg.subject||''}`} style={{
              flex:1, padding:12, borderRadius:12,
              background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
              color:'#fff', textAlign:'center', textDecoration:'none',
              fontWeight:700, fontSize:13,
              boxShadow:'0 4px 12px rgba(108,99,255,.3)',
            }}>
              <i className="bi bi-reply-fill me-2"></i>Reply via Email
            </a>
            <button onClick={() => { setViewMsg(null); setConfirm(viewMsg.id) }} style={{
              flex:1, padding:12, borderRadius:12,
              background:'#fff5f5', color:'#e53e3e',
              border:'1.5px solid #fed7d7', fontWeight:700,
              fontSize:13, cursor:'pointer',
            }}>
              <i className="bi bi-trash-fill me-2"></i>Delete
            </button>
          </div>
        </Modal>
      )}

      {confirm && <Confirm onCancel={() => setConfirm(null)} onConfirm={() => deleteContact(confirm)} msg="This message will be permanently deleted." />}
    </div>
  )
}

export default ContactsMgr