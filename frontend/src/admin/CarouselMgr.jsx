import { useState, useEffect } from 'react'
import { s, Modal, Confirm } from './adminStyles'

function getCsrf() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ''
}

function CarouselMgr() {
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
    fetch('/college-admin/api/carousel/', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditItem(null); setTitle(''); setFile(null); setModal(true) }
  const openEdit = (item) => { setEditItem(item); setTitle(item.title || ''); setFile(null); setModal(true) }

  const save = async () => {
    setSaving(true)
    try {
      if (editItem) {
        const res = await fetch(`/college-admin/api/carousel/edit/${editItem.id}/`, {
          method:'POST', credentials:'include',
          headers:{ 'Content-Type':'application/json','X-CSRFToken':getCsrf() },
          body: JSON.stringify({ title }),
        })
        const d = await res.json()
        if (d.success) { setModal(false); load() } else alert(d.error || 'Failed.')
      } else {
        if (!file) { alert('Please select an image.'); setSaving(false); return }
        const fd = new FormData(); fd.append('title', title); fd.append('image', file)
        const res = await fetch('/college-admin/api/carousel/add/', {
          method:'POST', credentials:'include',
          headers:{ 'X-CSRFToken':getCsrf() }, body: fd,
        })
        const d = await res.json()
        if (d.success) { setModal(false); load() } else alert(d.error || 'Failed.')
      }
    } catch { alert('Network error.') }
    setSaving(false)
  }

  const deleteItem = async (id) => {
    const res = await fetch(`/college-admin/api/carousel/delete/${id}/`, {
      method:'POST', credentials:'include', headers:{ 'X-CSRFToken':getCsrf() }
    })
    const d = await res.json()
    if (d.success) load(); else alert(d.error || 'Failed.')
    setConfirm(null)
  }

  const filtered = items.filter(i => (i.title||'').toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={s.pageHeader}>
        <div>
          <h4 style={s.pageTitle}>Carousel</h4>
          <p style={s.pageSubtitle}>Manage homepage slider images</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}>
          <i className="bi bi-plus-lg me-1"></i> Add Image
        </button>
      </div>

      <div style={s.card}>
        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.searchWrap}>
            <i className="bi bi-search" style={s.searchIcon}></i>
            <input type="text" placeholder="Search title..." value={search}
              onChange={e => setSearch(e.target.value)} style={s.searchInput} />
          </div>
          <span style={s.countBadge}>{filtered.length} images</span>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {['#','Image','Title','Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={s.emptyTd}><i className="bi bi-hourglass-split me-2"></i>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" style={s.emptyTd}>
                  <i className="bi bi-images" style={{ fontSize:'2rem', color:'#e2e8f0', display:'block', margin:'0 auto 8px' }}></i>
                  No carousel images found.
                </td></tr>
              ) : filtered.map((item, i) => (
                <tr key={item.id} style={s.tr}
                  onMouseEnter={e => e.currentTarget.style.background='#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <td style={s.td}><span style={s.indexBadge}>{i+1}</span></td>
                  <td style={s.td}>
                    <img src={item.image_url} alt={item.title}
                      style={{ width:80, height:50, objectFit:'cover', borderRadius:10, border:'2px solid #e8ecf4', boxShadow:'0 2px 8px rgba(0,0,0,.08)' }}
                      onError={e => e.target.style.display='none'} />
                  </td>
                  <td style={s.td}>
                    <span style={{ fontWeight:600, color:'#1a202c' }}>{item.title || <span style={{ color:'#a0aec0', fontStyle:'italic' }}>No title</span>}</span>
                  </td>
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
      </div>

      {/* Modal */}
      {modal && (
        <Modal title={editItem ? 'Edit Carousel' : 'Add Carousel Image'} onClose={() => setModal(false)}>
          <div style={s.formGroup}>
            <label style={s.label}>Title (optional)</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Enter image title" style={s.input} />
          </div>
          {!editItem && (
            <div style={s.formGroup}>
              <label style={s.label}>Image File *</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={s.input} />
              {file && <img src={URL.createObjectURL(file)} alt="preview"
                style={{ marginTop:10, width:'100%', maxHeight:160, objectFit:'cover', borderRadius:10 }} />}
            </div>
          )}
          <button onClick={save} disabled={saving} style={s.saveBtn}>
            {saving ? <><i className="bi bi-hourglass-split me-2"></i>Saving...</> : <><i className="bi bi-check-lg me-2"></i>Save</>}
          </button>
        </Modal>
      )}

      {/* Confirm */}
      {confirm && <Confirm onCancel={() => setConfirm(null)} onConfirm={() => deleteItem(confirm)} />}
    </div>
  )
}

export default CarouselMgr