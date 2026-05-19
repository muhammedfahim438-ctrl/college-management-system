import { useState, useEffect } from 'react'
import { s, Modal, Confirm, Pagination } from './adminStyles'  // FIX: import Pagination from adminStyles
import ImageCropper from './ImageCropper'

function getCsrf() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ''
}

function CarouselMgr() {
  const [items, setItems]               = useState([])
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(true)
  const [page, setPage]                 = useState(1)
  const [total, setTotal]               = useState(0)  // FIX: remove totalPages, use total
  const [modal, setModal]               = useState(false)
  const [editItem, setEditItem]         = useState(null)
  const [title, setTitle]               = useState('')
  const [rawSrc, setRawSrc]             = useState(null)
  const [croppedBlob, setCroppedBlob]   = useState(null)
  const [croppedPreview, setCroppedPreview] = useState(null)
  const [showCropper, setShowCropper]   = useState(false)
  const [saving, setSaving]             = useState(false)
  const [confirm, setConfirm]           = useState(null)

  // FIX: correct URL + handle plain array from DRF
  const load = () => {
    setLoading(true)
    fetch('/api/carousel/', { credentials:'include' })
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : (d.items || [])
        setItems(list)
        setTotal(list.length)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const resetModal = () => {
    setTitle(''); setRawSrc(null); setCroppedBlob(null)
    setCroppedPreview(null); setShowCropper(false)
  }

  const openAdd  = () => { setEditItem(null); resetModal(); setModal(true) }
  const openEdit = item => { setEditItem(item); setTitle(item.title||''); resetModal(); setModal(true) }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setRawSrc(URL.createObjectURL(file))
    setCroppedBlob(null); setCroppedPreview(null)
    setShowCropper(true)
  }

  const handleCropConfirm = (blob, previewUrl) => {
    setCroppedBlob(blob); setCroppedPreview(previewUrl); setShowCropper(false)
  }

  // FIX: correct API URLs for add/edit
  const save = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', title)
      if (croppedBlob) fd.append('image', croppedBlob, 'carousel.jpg')

      if (editItem) {
        if (!croppedBlob && !title) { alert('Nothing to update.'); setSaving(false); return }
        const res = await fetch(`/api/carousel/${editItem.id}/`, {
          method:'PUT', credentials:'include',
          headers:{ 'X-CSRFToken':getCsrf() }, body:fd,
        })
        if (res.ok) { setModal(false); load() } else {
          const d = await res.json(); alert(JSON.stringify(d))
        }
      } else {
        if (!croppedBlob) { alert('Please select and crop an image.'); setSaving(false); return }
        const res = await fetch('/api/carousel/', {
          method:'POST', credentials:'include',
          headers:{ 'X-CSRFToken':getCsrf() }, body:fd,
        })
        if (res.ok) { setModal(false); load() } else {
          const d = await res.json(); alert(JSON.stringify(d))
        }
      }
    } catch { alert('Network error.') }
    setSaving(false)
  }

  // FIX: correct delete URL
  const deleteItem = async id => {
    const res = await fetch(`/api/carousel/${id}/`, {
      method:'DELETE', credentials:'include', headers:{ 'X-CSRFToken':getCsrf() }
    })
    if (res.ok) load(); else alert('Delete failed.')
    setConfirm(null)
  }

  const filtered = items.filter(i => (i.title||'').toLowerCase().includes(search.toLowerCase()))

  const modalContent = (
    <>
      {editItem && !croppedPreview && (
        <div style={{ marginBottom:16 }}>
          <label style={s.label}>Current Image</label>
          <img src={editItem.image_url} alt="current"
            style={{ width:'100%', height:160, objectFit:'cover', borderRadius:12, border:'2px solid #e8ecf4' }} />
        </div>
      )}
      {croppedPreview && (
        <div style={{ marginBottom:16 }}>
          <label style={s.label}>Cropped Preview</label>
          <img src={croppedPreview} alt="preview"
            style={{ width:'100%', height:160, objectFit:'cover', borderRadius:12, border:'2px solid #c7d2fe' }} />
          <button onClick={() => setShowCropper(true)} style={{ marginTop:8, background:'#eef2ff', border:'1.5px solid #c7d2fe', color:'#6366f1', borderRadius:9, padding:'6px 14px', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <i className="bi bi-crop"></i> Re-crop
          </button>
        </div>
      )}
      <div style={s.formGroup}>
        <label style={s.label}>{editItem ? 'Change Image (optional)' : 'Select Image *'}</label>
        <label style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'14px', borderRadius:12, border:'2px dashed #c7d2fe', background:'#f8faff', cursor:'pointer', color:'#6366f1', fontWeight:700, fontSize:13 }}>
          <i className="bi bi-cloud-upload-fill" style={{ fontSize:'1.2rem' }}></i>
          {croppedBlob ? 'Change Image' : 'Choose & Crop Image'}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display:'none' }} />
        </label>
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Title (optional)</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Enter slide title" style={s.input} />
      </div>
      <button onClick={save} disabled={saving} style={s.saveBtn}>
        {saving ? <><i className="bi bi-hourglass-split me-2"></i>Saving...</> : <><i className="bi bi-check-lg me-2"></i>Save</>}
      </button>
    </>
  )

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h4 style={s.pageTitle}>Carousel</h4>
          <p style={s.pageSubtitle}>Manage homepage slider images</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}><i className="bi bi-plus-lg me-1"></i>Add Image</button>
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={s.searchWrap}>
          <i className="bi bi-search" style={s.searchIcon}></i>
          <input type="text" placeholder="Search title..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ ...s.searchInput, borderRadius:12 }} />
        </div>
      </div>

      {/* FIX: total now correctly set from array length */}
      <div style={{ fontSize:12, fontWeight:700, color:'#6366f1', background:'#eef2ff', padding:'5px 12px', borderRadius:20, display:'inline-block', marginBottom:16 }}>
        {total} slides total
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="mgr-desktop" style={s.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>{['#','Image','Title','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={s.emptyTd}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" style={s.emptyTd}>No carousel images found.</td></tr>
              ) : filtered.map((item, i) => (
                <tr key={item.id} style={s.tr}
                  onMouseEnter={e => e.currentTarget.style.background='#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <td style={s.td}><span style={s.indexBadge}>{i+1}</span></td>
                  <td style={s.td}>
                    <img src={item.image_url} alt={item.title}
                      style={{ width:100, height:56, objectFit:'cover', borderRadius:10, border:'2px solid #e8ecf4' }}
                      onError={e => e.target.style.display='none'} />
                  </td>
                  <td style={s.td}><strong style={{ color:'#1e1b4b' }}>{item.title||<span style={{ color:'#94a3b8', fontStyle:'italic' }}>No title</span>}</strong></td>
                  <td style={s.td}>
                    <div style={s.actionBtns}>
                      <button onClick={() => openEdit(item)} style={s.editBtn}><i className="bi bi-pencil-fill me-1"></i>Edit</button>
                      <button onClick={() => setConfirm(item.id)} style={s.delBtn}><i className="bi bi-trash-fill me-1"></i>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* FIX: correct Pagination props */}
        <Pagination total={total} perPage={10} page={page} setPage={setPage} />
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="mgr-mobile">
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>No carousel images found.</div>
        ) : filtered.map((item, i) => (
          <div key={item.id} style={{ background:'#fff', borderRadius:16, marginBottom:12, overflow:'hidden', boxShadow:'0 4px 16px rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.06)' }}>
            <div style={{ position:'relative', height:160 }}>
              <img src={item.image_url} alt={item.title}
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                onError={e => e.target.style.display='none'} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(30,27,75,.7) 0%,transparent 60%)' }}></div>
              <div style={{ position:'absolute', bottom:10, left:14, right:14 }}>
                <div style={{ fontWeight:700, color:'#fff', fontSize:14 }}>{item.title||<span style={{ fontStyle:'italic', opacity:.7 }}>No title</span>}</div>
              </div>
              <div style={{ position:'absolute', top:10, left:10, background:'rgba(99,102,241,.85)', color:'#fff', borderRadius:8, padding:'3px 10px', fontSize:11, fontWeight:700 }}>#{i+1}</div>
            </div>
            <div style={{ padding:'12px 14px', display:'flex', gap:8 }}>
              <button onClick={() => openEdit(item)} style={{ ...s.editBtn, flex:1, justifyContent:'center', padding:'10px' }}>
                <i className="bi bi-pencil-fill me-2"></i>Edit
              </button>
              <button onClick={() => setConfirm(item.id)} style={{ ...s.delBtn, flex:1, justifyContent:'center', padding:'10px' }}>
                <i className="bi bi-trash-fill me-2"></i>Delete
              </button>
            </div>
          </div>
        ))}
        <Pagination total={total} perPage={10} page={page} setPage={setPage} />
      </div>

      {modal && (
        <Modal title={editItem ? 'Edit Carousel Image' : 'Add Carousel Image'} onClose={() => { setModal(false); resetModal() }}>
          {modalContent}
        </Modal>
      )}

      {showCropper && rawSrc && (
        <ImageCropper imageSrc={rawSrc} aspect={16/9} onConfirm={handleCropConfirm} onCancel={() => setShowCropper(false)} />
      )}

      {confirm && <Confirm onCancel={() => setConfirm(null)} onConfirm={() => deleteItem(confirm)} />}

      <style>{`
        @media(min-width:769px){ .mgr-mobile{ display:none } .mgr-desktop{ display:block } }
        @media(max-width:768px){ .mgr-desktop{ display:none } .mgr-mobile{ display:block } }
      `}</style>
    </div>
  )
}

export default CarouselMgr