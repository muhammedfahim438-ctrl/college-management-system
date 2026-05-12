// ── Shared Louise-style admin styles ──────────────────────────────

export const s = {
  // Page header
  pageHeader:   { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 },
  pageTitle:    { fontSize:22, fontWeight:800, color:'#1a202c', margin:0 },
  pageSubtitle: { color:'#a0aec0', fontSize:13, margin:'4px 0 0' },

  // Card wrapper
  card: {
    background:'#fff', borderRadius:16,
    boxShadow:'0 4px 20px rgba(0,0,0,.06)',
    border:'1px solid #e8ecf4', overflow:'hidden',
  },

  // Toolbar
  toolbar: {
    display:'flex', alignItems:'center', gap:12,
    padding:'16px 20px', borderBottom:'1px solid #f0f4f8',
    flexWrap:'wrap',
  },
  searchWrap: { position:'relative', flex:1, minWidth:180 },
  searchIcon: { position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a0aec0', fontSize:'.85rem' },
  searchInput: {
    width:'100%', padding:'9px 13px 9px 34px',
    border:'1.5px solid #e2e8f0', borderRadius:10,
    fontSize:13, color:'#2d3748', outline:'none',
    background:'#f8fafc', boxSizing:'border-box',
  },
  countBadge: {
    fontSize:12, fontWeight:700, color:'#6c63ff',
    background:'#eef2ff', padding:'5px 12px',
    borderRadius:20, whiteSpace:'nowrap',
  },

  // Table
  table: { width:'100%', borderCollapse:'collapse' },
  th: {
    background:'#f8fafc', color:'#718096',
    fontSize:11, textTransform:'uppercase',
    letterSpacing:'.6px', fontWeight:700,
    padding:'13px 20px', borderBottom:'1px solid #e8ecf4',
    whiteSpace:'nowrap', textAlign:'left',
  },
  tr: { transition:'background .15s', cursor:'default' },
  td: { padding:'13px 20px', color:'#2d3748', fontSize:13.5, borderBottom:'1px solid #f0f4f8', verticalAlign:'middle' },
  emptyTd: { textAlign:'center', padding:'48px 20px', color:'#a0aec0', fontSize:14 },
  indexBadge: {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    width:28, height:28, borderRadius:8,
    background:'#eef2ff', color:'#6c63ff',
    fontSize:12, fontWeight:700,
  },

  // Action buttons
  actionBtns: { display:'flex', gap:8 },
  editBtn: {
    display:'inline-flex', alignItems:'center',
    background:'#eef2ff', color:'#6c63ff',
    border:'1.5px solid #c7d2fe',
    padding:'6px 13px', borderRadius:9,
    fontSize:12, fontWeight:600, cursor:'pointer',
  },
  delBtn: {
    display:'inline-flex', alignItems:'center',
    background:'#fff5f5', color:'#e53e3e',
    border:'1.5px solid #fed7d7',
    padding:'6px 13px', borderRadius:9,
    fontSize:12, fontWeight:600, cursor:'pointer',
  },
  viewBtn: {
    display:'inline-flex', alignItems:'center',
    background:'#e0f2fe', color:'#0284c7',
    border:'1.5px solid #bae6fd',
    padding:'6px 13px', borderRadius:9,
    fontSize:12, fontWeight:600, cursor:'pointer',
  },

  // Add button
  addBtn: {
    display:'inline-flex', alignItems:'center', gap:6,
    background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
    color:'#fff', border:'none',
    padding:'10px 20px', borderRadius:12,
    fontSize:13, fontWeight:700, cursor:'pointer',
    boxShadow:'0 4px 12px rgba(108,99,255,.3)',
  },

  // CSV button
  csvBtn: {
    display:'inline-flex', alignItems:'center', gap:6,
    background:'#f0fdf4', color:'#16a34a',
    border:'1.5px solid #bbf7d0',
    padding:'9px 18px', borderRadius:12,
    fontSize:13, fontWeight:600, cursor:'pointer',
  },

  // Select / filter
  select: {
    padding:'9px 13px', border:'1.5px solid #e2e8f0',
    borderRadius:10, fontSize:13, color:'#2d3748',
    outline:'none', background:'#f8fafc', cursor:'pointer',
  },

  // Pagination
  pagination: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'14px 20px', borderTop:'1px solid #f0f4f8',
    flexWrap:'wrap', gap:8,
  },
  pgInfo: { fontSize:12, color:'#a0aec0', fontWeight:500 },
  pgBtns: { display:'flex', gap:4 },

  // Form
  formGroup: { marginBottom:16 },
  label:  { display:'block', fontSize:12, fontWeight:700, color:'#4a5568', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:6 },
  input:  { width:'100%', padding:'10px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, color:'#2d3748', outline:'none', background:'#f8fafc', boxSizing:'border-box' },
  saveBtn: {
    width:'100%', background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
    color:'#fff', border:'none', padding:13, borderRadius:12,
    fontSize:14, fontWeight:700, cursor:'pointer', marginTop:4,
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow:'0 4px 12px rgba(108,99,255,.3)',
  },

  // Course badge
  courseBadge: {
    display:'inline-block', padding:'4px 12px',
    borderRadius:20, fontSize:11, fontWeight:700,
    background:'#eef2ff', color:'#6c63ff',
    border:'1px solid #c7d2fe',
  },
}

// ── Modal Component ────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,.6)',
      zIndex:999, display:'flex', alignItems:'center', justifyContent:'center',
      padding:16, backdropFilter:'blur(4px)',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background:'#fff', borderRadius:20, padding:32,
        width:'100%', maxWidth:500, position:'relative',
        maxHeight:'90vh', overflowY:'auto',
        boxShadow:'0 24px 64px rgba(0,0,0,.2)',
      }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h5 style={{ fontWeight:800, color:'#1a202c', margin:0, fontSize:17 }}>{title}</h5>
          <button onClick={onClose} style={{
            background:'#f5f6fa', border:'1.5px solid #e2e8f0',
            borderRadius:9, width:34, height:34,
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', color:'#718096', fontSize:'1rem',
          }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Confirm Dialog ─────────────────────────────────────────────────
export function Confirm({ onCancel, onConfirm, title='Delete?', msg='This action cannot be undone.' }) {
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,.6)',
      zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
      padding:16, backdropFilter:'blur(4px)',
    }}>
      <div style={{
        background:'#fff', borderRadius:20, padding:32,
        width:'100%', maxWidth:380, textAlign:'center',
        boxShadow:'0 24px 64px rgba(0,0,0,.2)',
      }}>
        <div style={{
          width:60, height:60, borderRadius:'50%',
          background:'linear-gradient(135deg,#fff5f5,#fed7d7)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 16px', fontSize:'1.6rem',
        }}>🗑️</div>
        <h6 style={{ fontWeight:800, color:'#1a202c', marginBottom:8, fontSize:17 }}>{title}</h6>
        <p style={{ color:'#718096', fontSize:13, marginBottom:28, lineHeight:1.6 }}>{msg}</p>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={onCancel} style={{
            flex:1, padding:'11px', borderRadius:12,
            border:'1.5px solid #e2e8f0', background:'#fff',
            fontWeight:700, fontSize:13, cursor:'pointer', color:'#4a5568',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex:1, padding:'11px', borderRadius:12,
            border:'none', background:'linear-gradient(135deg,#e53e3e,#fc8181)',
            color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer',
            boxShadow:'0 4px 12px rgba(229,62,62,.3)',
          }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  )
}

// ── Pagination Component ───────────────────────────────────────────
export function Pagination({ total, perPage, page, setPage }) {
  if (total <= perPage) return null
  const pages = Math.ceil(total / perPage)
  const from  = Math.min((page-1)*perPage+1, total)
  const to    = Math.min(page*perPage, total)
  return (
    <div style={s.pagination}>
      <span style={s.pgInfo}>Showing {from}–{to} of {total}</span>
      <div style={s.pgBtns}>
        {Array.from({ length: pages }, (_, i) => i+1).map(p => (
          <button key={p} onClick={() => setPage(p)} style={{
            padding:'6px 12px', borderRadius:9,
            border:'1.5px solid #e2e8f0',
            background: p === page ? 'linear-gradient(135deg,#6c63ff,#a78bfa)' : '#fff',
            color: p === page ? '#fff' : '#4a5568',
            borderColor: p === page ? '#6c63ff' : '#e2e8f0',
            fontSize:12, fontWeight:700, cursor:'pointer',
            boxShadow: p === page ? '0 4px 10px rgba(108,99,255,.3)' : 'none',
          }}>{p}</button>
        ))}
      </div>
    </div>
  )
}