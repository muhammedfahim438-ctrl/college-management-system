// ── Shared styles ─────────────────────────────────────────────────

export const s = {
  pageHeader:   { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 },
  pageTitle:    { fontSize:22, fontWeight:800, color:'#1e1b4b', margin:0 },
  pageSubtitle: { color:'#94a3b8', fontSize:13, margin:'4px 0 0' },

  card: {
    background:'#fff', borderRadius:16,
    boxShadow:'0 4px 20px rgba(99,102,241,.08)',
    border:'1px solid rgba(99,102,241,.08)', overflow:'hidden',
  },

  toolbar: {
    display:'flex', alignItems:'center', gap:12,
    padding:'16px 20px', borderBottom:'1px solid #f1f5f9',
    flexWrap:'wrap',
  },
  searchWrap:  { position:'relative', flex:1, minWidth:180 },
  searchIcon:  { position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#a5b4fc', fontSize:'.85rem' },
  searchInput: { width:'100%', padding:'9px 13px 9px 34px', border:'1.5px solid #e8ecf4', borderRadius:10, fontSize:13, color:'#1e1b4b', outline:'none', background:'#f8fafc', boxSizing:'border-box' },
  countBadge:  { fontSize:12, fontWeight:700, color:'#6366f1', background:'#eef2ff', padding:'5px 12px', borderRadius:20, whiteSpace:'nowrap' },

  table:     { width:'100%', borderCollapse:'collapse' },
  th:        { background:'#f8fafc', color:'#64748b', fontSize:11, textTransform:'uppercase', letterSpacing:'.6px', fontWeight:700, padding:'13px 20px', borderBottom:'1px solid #f1f5f9', whiteSpace:'nowrap', textAlign:'left' },
  tr:        { transition:'background .15s' },
  td:        { padding:'13px 20px', color:'#1e1b4b', fontSize:13.5, borderBottom:'1px solid #f8fafc', verticalAlign:'middle' },
  emptyTd:   { textAlign:'center', padding:'48px 20px', color:'#94a3b8', fontSize:14 },
  indexBadge:{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:8, background:'#eef2ff', color:'#6366f1', fontSize:12, fontWeight:700 },

  actionBtns: { display:'flex', gap:8 },
  editBtn:    { display:'inline-flex', alignItems:'center', background:'#eef2ff', color:'#6366f1', border:'1.5px solid #c7d2fe', padding:'6px 13px', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer' },
  delBtn:     { display:'inline-flex', alignItems:'center', background:'#fff5f5', color:'#e53e3e', border:'1.5px solid #fed7d7', padding:'6px 13px', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer' },
  viewBtn:    { display:'inline-flex', alignItems:'center', background:'#f0fdf4', color:'#16a34a', border:'1.5px solid #bbf7d0', padding:'6px 13px', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer' },

  addBtn:  { display:'inline-flex', alignItems:'center', gap:6, background:'linear-gradient(135deg,#6366f1,#a78bfa)', color:'#fff', border:'none', padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 12px rgba(99,102,241,.25)' },
  csvBtn:  { display:'inline-flex', alignItems:'center', gap:6, background:'#f0fdf4', color:'#16a34a', border:'1.5px solid #bbf7d0', padding:'9px 18px', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer' },
  select:  { padding:'9px 13px', border:'1.5px solid #e8ecf4', borderRadius:10, fontSize:13, color:'#1e1b4b', outline:'none', background:'#f8fafc', cursor:'pointer' },

  pagination: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderTop:'1px solid #f1f5f9', flexWrap:'wrap', gap:8 },
  pgInfo:     { fontSize:12, color:'#94a3b8', fontWeight:500 },
  pgBtns:     { display:'flex', gap:4 },

  formGroup: { marginBottom:16 },
  label:     { display:'block', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:6 },
  input:     { width:'100%', padding:'11px 14px', border:'1.5px solid #e8ecf4', borderRadius:10, fontSize:14, color:'#1e1b4b', outline:'none', background:'#f8fafc', boxSizing:'border-box' },
  saveBtn:   { width:'100%', background:'linear-gradient(135deg,#6366f1,#a78bfa)', color:'#fff', border:'none', padding:13, borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', marginTop:4, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(99,102,241,.25)' },
  courseBadge:{ display:'inline-block', padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, background:'#eef2ff', color:'#6366f1', border:'1px solid #c7d2fe' },
}

// ── Mobile Card ────────────────────────────────────────────────────
export function MobileCard({ children, style = {} }) {
  return (
    <div style={{
      background:'#fff', borderRadius:16,
      boxShadow:'0 4px 16px rgba(99,102,241,.08)',
      border:'1px solid rgba(99,102,241,.06)',
      padding:'16px', marginBottom:12,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── Modal (Desktop center / Mobile bottom sheet) ───────────────────
export function Modal({ title, onClose, children }) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position:'fixed', inset:0,
        background:'rgba(15,23,42,.4)',
        zIndex:998, backdropFilter:'blur(4px)',
      }} />

      {/* Desktop — center modal */}
      <div className="modal-desktop" style={{
        position:'fixed', inset:0, zIndex:999,
        display:'flex', alignItems:'center', justifyContent:'center', padding:16,
      }}>
        <div style={{
          background:'#fff', borderRadius:20, padding:32,
          width:'100%', maxWidth:500,
          maxHeight:'90vh', overflowY:'auto',
          boxShadow:'0 24px 64px rgba(99,102,241,.15)',
          border:'1px solid rgba(99,102,241,.1)',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
            <h5 style={{ fontWeight:800, color:'#1e1b4b', margin:0, fontSize:17 }}>{title}</h5>
            <button onClick={onClose} style={{ background:'#f8fafc', border:'1.5px solid #e8ecf4', borderRadius:9, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          {children}
        </div>
      </div>

      {/* Mobile — bottom sheet */}
      <div className="modal-mobile" style={{
        position:'fixed', bottom:0, left:0, right:0, zIndex:999,
        background:'#fff',
        borderRadius:'24px 24px 0 0',
        padding:'0 20px 40px',
        boxShadow:'0 -8px 40px rgba(99,102,241,.15)',
        border:'1px solid rgba(99,102,241,.08)',
        maxHeight:'92vh', overflowY:'auto',
        animation:'slideUp .3s ease',
      }}>
        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
          <div style={{ width:40, height:4, borderRadius:4, background:'#e2e8f0' }}></div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:'12px 0 20px' }}>
          <h5 style={{ fontWeight:800, color:'#1e1b4b', margin:0, fontSize:17 }}>{title}</h5>
          <button onClick={onClose} style={{ background:'#f8fafc', border:'1.5px solid #e8ecf4', borderRadius:9, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        {children}
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @media(min-width:769px){ .modal-mobile{ display:none !important } }
        @media(max-width:768px){ .modal-desktop{ display:none !important } }
      `}</style>
    </>
  )
}

// ── Confirm Dialog ─────────────────────────────────────────────────
export function Confirm({ onCancel, onConfirm, title='Delete?', msg='This action cannot be undone.' }) {
  return (
    <>
      <div onClick={onCancel} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.4)', zIndex:998, backdropFilter:'blur(4px)' }} />

      {/* Desktop */}
      <div className="confirm-desktop" style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <div style={{ background:'#fff', borderRadius:20, padding:32, width:'100%', maxWidth:360, textAlign:'center', boxShadow:'0 24px 64px rgba(99,102,241,.15)' }}>
          <ConfirmContent title={title} msg={msg} onCancel={onCancel} onConfirm={onConfirm} />
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div className="confirm-mobile" style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:999, background:'#fff', borderRadius:'24px 24px 0 0', padding:'16px 24px 48px', boxShadow:'0 -8px 40px rgba(99,102,241,.15)', animation:'slideUp .3s ease', textAlign:'center' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <div style={{ width:40, height:4, borderRadius:4, background:'#e2e8f0' }}></div>
        </div>
        <ConfirmContent title={title} msg={msg} onCancel={onCancel} onConfirm={onConfirm} />
      </div>

      <style>{`
        @media(min-width:769px){ .confirm-mobile{ display:none !important } }
        @media(max-width:768px){ .confirm-desktop{ display:none !important } }
      `}</style>
    </>
  )
}

function ConfirmContent({ title, msg, onCancel, onConfirm }) {
  return (
    <>
      <div style={{ width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg,#fff5f5,#fed7d7)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'1.6rem' }}>🗑️</div>
      <h6 style={{ fontWeight:800, color:'#1e1b4b', marginBottom:8, fontSize:17 }}>{title}</h6>
      <p style={{ color:'#64748b', fontSize:13, marginBottom:24, lineHeight:1.6 }}>{msg}</p>
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={onCancel} style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #e8ecf4', background:'#f8fafc', fontWeight:700, fontSize:13, cursor:'pointer', color:'#64748b' }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 12px rgba(239,68,68,.25)' }}>Yes, Delete</button>
      </div>
    </>
  )
}

// ── Pagination ─────────────────────────────────────────────────────
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
            border:'1.5px solid #e8ecf4',
            background: p === page ? 'linear-gradient(135deg,#6366f1,#a78bfa)' : '#fff',
            color: p === page ? '#fff' : '#64748b',
            borderColor: p === page ? '#6366f1' : '#e8ecf4',
            fontSize:12, fontWeight:700, cursor:'pointer',
            boxShadow: p === page ? '0 4px 10px rgba(99,102,241,.25)' : 'none',
          }}>{p}</button>
        ))}
      </div>
    </div>
  )
}