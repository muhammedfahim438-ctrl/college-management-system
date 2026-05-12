import { useState, useEffect } from 'react'

function getCsrf() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ''
}

function GalleryMgr() {
  const [items, setItems]       = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [title, setTitle]       = useState('')
  const [file, setFile]         = useState(null)
  const [saving, setSaving]     = useState(false)
  const [confirm, setConfirm]   = useState(null)

  const load = () => {
    setLoading(true)
    fetch('/college-admin/api/gallery/', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditItem(null); setTitle(''); setFile(null)
    setModal(true)
  }

  const openEdit = (item) => {
    setEditItem(item); setTitle(item.title || ''); setFile(null)
    setModal(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      if (editItem) {
        const res = await fetch(`/college-admin/api/gallery/edit/${editItem.id}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrf() },
          credentials: 'include',
          body: JSON.stringify({ title }),
        })
        const d = await res.json()
        if (d.success) { setModal(false); load() }
        else alert(d.error || 'Failed to save.')
      } else {
        if (!file) { alert('Please select an image.'); setSaving(false); return }
        const fd = new FormData()
        fd.append('title', title)
        fd.append('image', file)
        const res = await fetch('/college-admin/api/gallery/add/', {
          method: 'POST',
          headers: { 'X-CSRFToken': getCsrf() },
          credentials: 'include',
          body: fd,
        })
        const d = await res.json()
        if (d.success) { setModal(false); load() }
        else alert(d.error || 'Failed to upload.')
      }
    } catch { alert('Network error.') }
    setSaving(false)
  }

  const deleteItem = async (id) => {
    const res = await fetch(`/college-admin/api/gallery/delete/${id}/`, {
      method: 'POST',
      headers: { 'X-CSRFToken': getCsrf() },
      credentials: 'include',
    })
    const d = await res.json()
    if (d.success) load()
    else alert(d.error || 'Failed to delete.')
    setConfirm(null)
  }

  const filtered = items.filter(i =>
    (i.title || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h4 style={{ fontSize: 21, fontWeight: 700, color: '#1a202c', margin: 0 }}>Gallery</h4>
          <p style={{ color: '#718096', fontSize: 13, margin: '3px 0 0' }}>Manage gallery images</p>
        </div>
        <button onClick={openAdd} style={addBtnStyle}>+ Add Image</button>
      </div>

      {/* Toolbar */}
      <div style={toolbarStyle}>
        <input
          type="text" placeholder="🔍 Search title..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={searchStyle}
        />
        <span style={{ fontSize: 12, color: '#718096', whiteSpace: 'nowrap' }}>
          {filtered.length} image{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={tableWrapStyle}>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={centerTd}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="4" style={centerTd}>No gallery images found.</td></tr>
            ) : (
              filtered.map((item, i) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                      onError={e => e.target.style.display = 'none'}
                    />
                  </td>
                  <td style={tdStyle}><strong>{item.title || '(No title)'}</strong></td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(item)} style={editBtnStyle}>Edit</button>
                      <button onClick={() => setConfirm(item.id)} style={delBtnStyle}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div style={modalBgStyle} onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={modalBoxStyle}>
            <button onClick={() => setModal(false)} style={closeStyle}>✕</button>
            <h5 style={{ fontWeight: 700, color: '#1a202c', margin: '0 0 20px' }}>
              {editItem ? 'Edit Gallery Title' : 'Add Gallery Image'}
            </h5>
            <div style={{ marginBottom: 14 }}>
              <label style={lblStyle}>Title (optional)</label>
              <input
                type="text" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter image title"
                style={inputStyle}
              />
            </div>
            {!editItem && (
              <div style={{ marginBottom: 14 }}>
                <label style={lblStyle}>Image File *</label>
                <input
                  type="file" accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  style={inputStyle}
                />
                {/* Preview */}
                {file && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{ marginTop: 10, width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }}
                  />
                )}
              </div>
            )}
            <button onClick={save} disabled={saving} style={saveBtnStyle}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {confirm && (
        <div style={modalBgStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: 360, textAlign: 'center' }}>
            <div style={{ width: 54, height: 54, background: '#fff5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem' }}>🗑️</div>
            <h6 style={{ fontWeight: 700, color: '#1a202c', marginBottom: 8 }}>Delete Image?</h6>
            <p style={{ color: '#718096', fontSize: 13, marginBottom: 24 }}>This image will be permanently removed.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirm(null)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => deleteItem(confirm)} style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none', background: '#e53e3e', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared Styles ──
const addBtnStyle = { display:'inline-flex',alignItems:'center',gap:6,background:'#6366f1',color:'#fff',border:'none',padding:'9px 18px',borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer' }
const toolbarStyle = { background:'#fff',borderRadius:'14px 14px 0 0',border:'1px solid #e8ecf0',borderBottom:'none',padding:'14px 16px',display:'flex',gap:10,alignItems:'center' }
const searchStyle = { flex:1,padding:'8px 13px',border:'1.5px solid #e2e8f0',borderRadius:9,fontSize:13,outline:'none',background:'#f8fafc' }
const tableWrapStyle = { background:'#fff',borderRadius:'0 0 14px 14px',border:'1px solid #e8ecf0',borderTop:'none',overflow:'hidden' }
const thStyle = { background:'#f8fafc',color:'#4a5568',fontSize:11,textTransform:'uppercase',letterSpacing:'.5px',padding:'13px 15px',borderBottom:'1px solid #e8ecf0',whiteSpace:'nowrap',fontWeight:700 }
const tdStyle = { padding:'11px 15px',verticalAlign:'middle',color:'#2d3748',fontSize:13.5,borderColor:'#f0f4f8' }
const centerTd = { textAlign:'center',padding:'32px',color:'#a0aec0',fontSize:14 }
const editBtnStyle = { background:'#eff6ff',color:'#2563eb',border:'1px solid #bfdbfe',padding:'5px 11px',borderRadius:7,fontSize:12,cursor:'pointer' }
const delBtnStyle = { background:'#fff5f5',color:'#e53e3e',border:'1px solid #fed7d7',padding:'5px 11px',borderRadius:7,fontSize:12,cursor:'pointer' }
const modalBgStyle = { position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }
const modalBoxStyle = { background:'#fff',borderRadius:16,padding:30,width:'100%',maxWidth:480,position:'relative',maxHeight:'90vh',overflowY:'auto' }
const closeStyle = { position:'absolute',top:14,right:14,background:'#f7fafc',border:'none',borderRadius:8,width:30,height:30,fontSize:15,color:'#718096',cursor:'pointer' }
const lblStyle = { display:'block',fontSize:13,fontWeight:500,color:'#4a5568',marginBottom:5 }
const inputStyle = { width:'100%',padding:'9px 13px',border:'1.5px solid #e2e8f0',borderRadius:9,fontSize:14,color:'#2d3748',outline:'none',background:'#f8fafc',boxSizing:'border-box' }
const saveBtnStyle = { width:'100%',background:'#6366f1',color:'#fff',border:'none',padding:11,borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer',marginTop:6 }

export default GalleryMgr