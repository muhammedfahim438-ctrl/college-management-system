import { useState, useEffect } from 'react'

function getCsrf() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ''
}

const emptyForm = { name: '', email: '', phone: '', course: '', date_of_joining: '' }

function StudentsMgr() {
  const [students, setStudents] = useState([])
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [confirm, setConfirm]   = useState(null)
  const [page, setPage]         = useState(1)
  const perPage = 10

  const load = () => {
    setLoading(true)
    fetch('/college-admin/api/students/', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setStudents(d.students || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditId(null); setForm(emptyForm); setModal(true)
  }

  const openEdit = (s) => {
    setEditId(s.id)
    setForm({ name: s.name, email: s.email, phone: s.phone || '', course: s.course || '', date_of_joining: s.date_of_joining || '' })
    setModal(true)
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const save = async () => {
    if (!form.name || !form.email || !form.phone || !form.course || !form.date_of_joining) {
      alert('Please fill all fields.'); return
    }
    setSaving(true)
    try {
      const url = editId
        ? `/college-admin/api/students/edit/${editId}/`
        : '/college-admin/api/students/add/'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrf() },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (d.success) { setModal(false); load() }
      else alert(d.error || 'Failed to save.')
    } catch { alert('Network error.') }
    setSaving(false)
  }

  const deleteStudent = async (id) => {
    const res = await fetch(`/college-admin/api/students/delete/${id}/`, {
      method: 'POST',
      headers: { 'X-CSRFToken': getCsrf() },
      credentials: 'include',
    })
    const d = await res.json()
    if (d.success) load()
    else alert(d.error || 'Failed to delete.')
    setConfirm(null)
  }

  // Export CSV
  const exportCSV = () => {
    const headers = ['#', 'Name', 'Email', 'Phone', 'Course', 'Date of Joining']
    const rows = students.map((s, i) => [i + 1, s.name, s.email, s.phone || '', s.course || '', s.date_of_joining || ''])
    const csv = [headers, ...rows].map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'students_export.csv'; a.click()
  }

  // Filter + search
  const courses = [...new Set(students.map(s => s.course).filter(Boolean))].sort()
  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchQ = !q || (s.name + s.email + (s.course || '')).toLowerCase().includes(q)
    const matchC = !filter || s.course === filter
    return matchQ && matchC
  })

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h4 style={{ fontSize: 21, fontWeight: 700, color: '#1a202c', margin: 0 }}>Students</h4>
          <p style={{ color: '#718096', fontSize: 13, margin: '3px 0 0' }}>Add, edit and delete student records</p>
        </div>
        <button onClick={openAdd} style={addBtnStyle}>+ Add Student</button>
      </div>

      {/* Toolbar */}
      <div style={toolbarStyle}>
        <input
          type="text" placeholder="🔍 Search name, email, course..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ ...searchStyle, flex: 2 }}
        />
        <select
          value={filter} onChange={e => { setFilter(e.target.value); setPage(1) }}
          style={selectStyle}
        >
          <option value="">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={exportCSV} style={csvBtnStyle}>⬇ CSV</button>
      </div>

      {/* Table */}
      <div style={tableWrapStyle}>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Joined</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={centerTd}>Loading...</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan="7" style={centerTd}>No students found.</td></tr>
            ) : (
              paged.map((s, i) => (
                <tr key={s.id}>
                  <td style={tdStyle}>{(page - 1) * perPage + i + 1}</td>
                  <td style={tdStyle}><strong>{s.name}</strong></td>
                  <td style={tdStyle}>{s.email}</td>
                  <td style={tdStyle}>{s.phone || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ display:'inline-block',padding:'3px 9px',borderRadius:20,fontSize:11,fontWeight:600,background:'#ede9fe',color:'#6d28d9' }}>
                      {s.course || '—'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, whiteSpace: 'nowrap' }}>{s.date_of_joining || '—'}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(s)} style={editBtnStyle}>Edit</button>
                      <button onClick={() => setConfirm(s.id)} style={delBtnStyle}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 16px',background:'#fff',border:'1px solid #e8ecf0',borderTop:'1px solid #f0f4f8',flexWrap:'wrap',gap:8 }}>
          <span style={{ fontSize:12,color:'#718096' }}>
            Showing {Math.min((page-1)*perPage+1,total)}–{Math.min(page*perPage,total)} of {total}
          </span>
          <div style={{ display:'flex',gap:4 }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                padding:'5px 11px',border:'1.5px solid #e2e8f0',
                background: p === page ? '#6366f1' : '#fff',
                color: p === page ? '#fff' : '#4a5568',
                borderColor: p === page ? '#6366f1' : '#e2e8f0',
                borderRadius:7,fontSize:12,cursor:'pointer'
              }}>{p}</button>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div style={modalBgStyle} onClick={e => { if (e.target === e.currentTarget) setModal(false) }}>
          <div style={modalBoxStyle}>
            <button onClick={() => setModal(false)} style={closeStyle}>✕</button>
            <h5 style={{ fontWeight: 700, color: '#1a202c', margin: '0 0 20px' }}>
              {editId ? 'Edit Student' : 'Add Student'}
            </h5>
            {[
              { label: 'Full Name *',       name: 'name',            type: 'text',  placeholder: 'Enter full name' },
              { label: 'Email *',           name: 'email',           type: 'email', placeholder: 'Enter email address' },
              { label: 'Phone *',           name: 'phone',           type: 'text',  placeholder: 'Enter phone number' },
              { label: 'Course *',          name: 'course',          type: 'text',  placeholder: 'Enter course name' },
              { label: 'Date of Joining *', name: 'date_of_joining', type: 'date',  placeholder: '' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <label style={lblStyle}>{f.label}</label>
                <input
                  type={f.type} name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
            <button onClick={save} disabled={saving} style={saveBtnStyle}>
              {saving ? 'Saving...' : 'Save Student'}
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {confirm && (
        <div style={modalBgStyle}>
          <div style={{ ...modalBoxStyle, maxWidth: 360, textAlign: 'center' }}>
            <div style={{ width:54,height:54,background:'#fff5f5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:'1.5rem' }}>🗑️</div>
            <h6 style={{ fontWeight:700,color:'#1a202c',marginBottom:8 }}>Delete Student?</h6>
            <p style={{ color:'#718096',fontSize:13,marginBottom:24 }}>This student record will be permanently removed.</p>
            <div style={{ display:'flex',gap:10 }}>
              <button onClick={() => setConfirm(null)} style={{ flex:1,padding:10,borderRadius:10,border:'1.5px solid #e2e8f0',background:'#fff',fontWeight:600,cursor:'pointer' }}>Cancel</button>
              <button onClick={() => deleteStudent(confirm)} style={{ flex:1,padding:10,borderRadius:10,border:'none',background:'#e53e3e',color:'#fff',fontWeight:600,cursor:'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Shared Styles ──
const addBtnStyle = { display:'inline-flex',alignItems:'center',gap:6,background:'#6366f1',color:'#fff',border:'none',padding:'9px 18px',borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer' }
const toolbarStyle = { background:'#fff',borderRadius:'14px 14px 0 0',border:'1px solid #e8ecf0',borderBottom:'none',padding:'14px 16px',display:'flex',gap:10,alignItems:'center',flexWrap:'wrap' }
const searchStyle = { padding:'8px 13px',border:'1.5px solid #e2e8f0',borderRadius:9,fontSize:13,outline:'none',background:'#f8fafc' }
const selectStyle = { padding:'8px 13px',border:'1.5px solid #e2e8f0',borderRadius:9,fontSize:13,outline:'none',background:'#f8fafc',cursor:'pointer' }
const csvBtnStyle = { display:'inline-flex',alignItems:'center',gap:5,background:'#eff6ff',color:'#2563eb',border:'1.5px solid #bfdbfe',padding:'7px 13px',borderRadius:9,fontSize:12,fontWeight:600,cursor:'pointer' }
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

export default StudentsMgr