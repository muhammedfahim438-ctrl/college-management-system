export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  // Build page numbers: show current ± 1 + first + last
  const getPages = () => {
    const pages = []
    const delta = 1
    const left  = Math.max(1, page - delta)
    const right = Math.min(totalPages, page + delta)

    if (left > 1) pages.push(1)
    if (left > 2) pages.push('...')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push('...')
    if (right < totalPages) pages.push(totalPages)
    return pages
  }

  const btn = (content, onClick, active = false, disabled = false) => (
    <button
      key={content}
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth:   active ? 36 : 36,
        height:     36,
        padding:    '0 10px',
        borderRadius: 10,
        border:     active ? 'none' : '1.5px solid #e8ecf4',
        background: active
          ? 'linear-gradient(135deg,#6366f1,#a78bfa)'
          : disabled ? '#f8fafc' : '#fff',
        color:      active ? '#fff' : disabled ? '#c7d2fe' : '#1e1b4b',
        fontWeight: 700,
        fontSize:   13,
        cursor:     disabled ? 'not-allowed' : 'pointer',
        boxShadow:  active ? '0 4px 10px rgba(99,102,241,.25)' : 'none',
        transition: 'all .2s',
        fontFamily: "'Segoe UI',sans-serif",
      }}
      onMouseEnter={e => {
        if (!active && !disabled)
          e.currentTarget.style.background = 'rgba(99,102,241,.08)'
      }}
      onMouseLeave={e => {
        if (!active && !disabled)
          e.currentTarget.style.background = '#fff'
      }}
    >
      {content}
    </button>
  )

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '14px 20px',
      borderTop:      '1px solid #f1f5f9',
      flexWrap:       'wrap',
      gap:            8,
      background:     '#fff',
    }}>
      {/* Info */}
      <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>
        Page {page} of {totalPages}
      </span>

      {/* Buttons */}
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        {/* Prev */}
        {btn(
          <><i className="bi bi-chevron-left" style={{ fontSize:11 }}></i> Prev</>,
          () => onPageChange(page - 1),
          false,
          page === 1
        )}

        {/* Page numbers */}
        {getPages().map((p, i) =>
          p === '...'
            ? <span key={`dots-${i}`} style={{ color:'#94a3b8', fontSize:13, padding:'0 4px' }}>...</span>
            : btn(p, () => onPageChange(p), p === page)
        )}

        {/* Next */}
        {btn(
          <>Next <i className="bi bi-chevron-right" style={{ fontSize:11 }}></i></>,
          () => onPageChange(page + 1),
          false,
          page === totalPages
        )}
      </div>
    </div>
  )
}