import { useState, useEffect } from 'react'
import { s, Modal, Confirm, Pagination } from './adminStyles'

// ── FIX 1: Define perPage constant ──────────────────────────────
const perPage = 10

function getCsrf() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ''
}

const COURSE_GROUPS = [
  {
    group: '🔬 Science',
    courses: ['BSc Physics','BSc Chemistry','BSc Zoology','BSc Botany','BSc Mathematics','BSc Microbiology','BSc Electronics','BSc Statistics'],
  },
  {
    group: '💻 Computer',
    courses: ['BCA','BSc Computer Science','BSc AI & ML','BSc IT','BSc Data Science','BSc Cyber Security','BSc IoT','BSc Cloud Computing'],
  },
  {
    group: '📊 Commerce',
    courses: ['BCom Finance','BCom Banking','BCom Marketing','BCom Taxation','BCom HR','BCom E-Commerce','BCom Business Analytics','BCom Accounting'],
  },
]

const empty = { name:'', email:'', phone:'', course:'', date_of_joining:'' }

function StudentsMgr() {
  const [students, setStudents] = useState([])
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(empty)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [confirm, setConfirm]   = useState(null)
  const [page, setPage]         = useState(1)
  const [total, setTotal]       = useState(0)

  const load = (p = page) => {
    setLoading(true)
    fetch(`/api/students/`, { credentials:'include' })
      .then(r => r.json())
      .then(d => {
        // DRF returns plain array
        const list = Array.isArray(d) ? d : (d.students || [])
        setStudents(list)
        setTotal(list.length)
        setPage(1)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load(1) }, [])

  const openAdd  = () => { setEditId(null); setForm(empty); setModal(true) }
  const openEdit = st => {
    setEditId(st.id)
    // Split stored phone "+91 98765 43210" back into code and number
    const phoneParts = (st.phone || '').match(/^(\+\d+)\s*(.*)$/)
    const phoneCode = phoneParts ? phoneParts[1] : '+91'
    const phoneNum  = phoneParts ? phoneParts[2].trim() : (st.phone || '')
    setForm({
      name: st.name, email: st.email,
      phoneCode, phone: phoneNum,
      course: st.course||'', date_of_joining: st.date_of_joining||''
    })
    setModal(true)
  }
  const handleChange = e => {
    const { name, value } = e.target
    let val = value

    if (name === 'name') {
      // Auto uppercase every word
      val = value.replace(/\b\w/g, c => c.toUpperCase())
    }

    if (name === 'email') {
      // Always lowercase
      val = value.toLowerCase()
    }

    if (name === 'phone') {
      // Only digits, max 10
      const digits = value.replace(/\D/g, '').slice(0, 10)
      // Format: XXXXX XXXXX
      val = digits.length > 5 ? digits.slice(0, 5) + ' ' + digits.slice(5) : digits
    }

    setForm({ ...form, [name]: val })
  }

  const save = async () => {
    if (!form.name||!form.email||!form.phone||!form.course||!form.date_of_joining) { alert('Please fill all fields.'); return }
    if (!form.email.includes('@')) { alert('Please enter a valid email with @.'); return }
    const rawDigits = form.phone.replace(/\D/g, '')
    if (rawDigits.length !== 10) { alert('Please enter a valid 10-digit phone number.'); return }
    const joinYear = new Date(form.date_of_joining).getFullYear()
    if (joinYear <= 2011) { alert('Date of joining must be after 2011.'); return }
    // Combine country code + phone for storage
    const phoneCode = form.phoneCode || '+91'
    const fullPhone = `${phoneCode} ${form.phone}`
    const payload = { ...form, phone: fullPhone }
    setSaving(true)
    try {
      const url = editId ? `/college-admin/api/students/edit/${editId}/` : '/college-admin/api/students/add/'
      const res = await fetch(url, {
        method:'POST', credentials:'include',
        headers:{ 'Content-Type':'application/json','X-CSRFToken':getCsrf() },
        body:JSON.stringify(form)
      })
      const d = await res.json()
      if (d.success) { setModal(false); load(1) } else alert(d.error||'Failed.')
    } catch { alert('Network error.') }
    setSaving(false)
  }

  const deleteStudent = async id => {
    const res = await fetch(`/college-admin/api/students/delete/${id}/`, {
      method:'POST', credentials:'include', headers:{ 'X-CSRFToken':getCsrf() }
    })
    const d = await res.json()
    if (d.success) load(); else alert(d.error||'Failed.')
    setConfirm(null)
  }

  const exportCSV = () => {
    const headers = ['#','Name','Email','Phone','Course','Date of Joining']
    const rows = students.map((st,i) => [i+1,st.name,st.email,st.phone||'',st.course||'',st.date_of_joining||''])
    const csv = [headers,...rows].map(r => r.map(c => `"${(c||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,'+encodeURIComponent(csv)
    a.download = 'students.csv'; a.click()
  }

  const filtered = students.filter(st => {
    const q = search.toLowerCase()
    return (!q||(st.name+st.email+(st.course||'')).toLowerCase().includes(q)) && (!filter||st.course===filter)
  })

  // ── FIX 1 (continued): perPage is now defined above ──
  const paged = filtered.slice((page-1)*perPage, page*perPage)

  // ── FIX 2: Use "form-" prefix to avoid duplicate keys ──────────
  const CourseSelect = ({ value, onChange, style = {} }) => (
    <select name="course" value={value} onChange={onChange} style={{ ...s.input, ...style }}>
      <option value="">Select a course</option>
      {COURSE_GROUPS.map(g => (
        <optgroup key={`form-${g.group}`} label={g.group}>
          {g.courses.map(c => <option key={`form-${c}`} value={c}>{c}</option>)}
        </optgroup>
      ))}
    </select>
  )

  const courseBadgeStyle = course => {
    if (!course) return s.courseBadge
    if (COURSE_GROUPS[0].courses.includes(course)) return { ...s.courseBadge, background:'#d1fae5', color:'#065f46', borderColor:'#a7f3d0' }
    if (COURSE_GROUPS[1].courses.includes(course)) return { ...s.courseBadge, background:'#e0f2fe', color:'#0369a1', borderColor:'#bae6fd' }
    return { ...s.courseBadge, background:'#fef3c7', color:'#92400e', borderColor:'#fcd34d' }
  }

  const modalContent = (
    <>
      {[
        { label:'Full Name *', name:'name', type:'text', placeholder:'Enter full name' },
        { label:'Email *',     name:'email', type:'email', placeholder:'Enter email' },
        { label:'Phone *',     name:'phone', type:'text', placeholder:'Enter phone number' },
      ].map(f => (
        <div key={f.name} style={s.formGroup}>
          <label style={s.label}>{f.label}</label>
          <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} style={s.input} />
        </div>
      ))}
      <div style={s.formGroup}>
        <label style={s.label}>Course *</label>
        <CourseSelect value={form.course} onChange={handleChange} />
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Date of Joining *</label>
        <input type="date" name="date_of_joining" value={form.date_of_joining} onChange={handleChange}
          min="2012-01-01"
          style={s.input} />
      </div>
      <button onClick={save} disabled={saving} style={s.saveBtn}>
        {saving ? <><i className="bi bi-hourglass-split me-2"></i>Saving...</> : <><i className="bi bi-check-lg me-2"></i>Save Student</>}
      </button>
    </>
  )

  return (
    <div>
      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <h4 style={s.pageTitle}>Students</h4>
          <p style={s.pageSubtitle}>Manage student records</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={exportCSV} style={s.csvBtn}><i className="bi bi-download me-1"></i>CSV</button>
          <button onClick={openAdd} style={s.addBtn}><i className="bi bi-plus-lg me-1"></i>Add</button>
        </div>
      </div>

      {/* Search + Filter */}
      {/* ── FIX 2 (continued): Use "filter-" prefix here ── */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ ...s.searchWrap, flex:2, minWidth:180 }}>
          <i className="bi bi-search" style={s.searchIcon}></i>
          <input type="text" placeholder="Search name, email, course..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{ ...s.searchInput, borderRadius:12 }} />
        </div>
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1) }}
          style={{ ...s.select, borderRadius:12, minWidth:140 }}>
          <option value="">All Courses</option>
          {COURSE_GROUPS.map(g => (
            <optgroup key={`filter-${g.group}`} label={g.group}>
              {g.courses.map(c => <option key={`filter-${c}`} value={c}>{c}</option>)}
            </optgroup>
          ))}
        </select>
      </div>

      <div style={{ fontSize:12, fontWeight:700, color:'#6366f1', background:'#eef2ff', padding:'5px 12px', borderRadius:20, display:'inline-block', marginBottom:16 }}>
        {filtered.length} students
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="mgr-desktop">
        <div style={s.card}>
          <div style={{ overflowX:'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>{['#','Name','Email','Phone','Course','Joined','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={s.emptyTd}>Loading...</td></tr>
                ) : paged.length === 0 ? (
                  <tr><td colSpan="7" style={s.emptyTd}>No students found.</td></tr>
                ) : paged.map((st, i) => (
                  <tr key={st.id} style={s.tr}
                    onMouseEnter={e => e.currentTarget.style.background='#fafbff'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    <td style={s.td}><span style={s.indexBadge}>{(page-1)*perPage+i+1}</span></td>
                    <td style={s.td}><strong style={{ color:'#1e1b4b' }}>{st.name}</strong></td>
                    <td style={s.td}><span style={{ color:'#64748b' }}>{st.email}</span></td>
                    <td style={s.td}>{st.phone||'—'}</td>
                    <td style={s.td}><span style={courseBadgeStyle(st.course)}>{st.course||'—'}</span></td>
                    <td style={{ ...s.td, fontSize:12, color:'#64748b', whiteSpace:'nowrap' }}>{st.date_of_joining||'—'}</td>
                    <td style={s.td}>
                      <div style={s.actionBtns}>
                        <button onClick={() => openEdit(st)} style={s.editBtn}><i className="bi bi-pencil-fill me-1"></i>Edit</button>
                        <button onClick={() => setConfirm(st.id)} style={s.delBtn}><i className="bi bi-trash-fill me-1"></i>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total={total} perPage={perPage} page={page} setPage={setPage} />
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="mgr-mobile">
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>Loading...</div>
        ) : paged.length === 0 ? (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>No students found.</div>
        ) : (
          <>
            {paged.map((st, i) => (
              <div key={st.id} style={{ background:'#fff', borderRadius:16, padding:16, marginBottom:12, boxShadow:'0 4px 16px rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.06)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16, flexShrink:0 }}>
                    {st.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:15, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{st.name}</div>
                    <div style={{ fontSize:12, color:'#64748b', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{st.email}</div>
                  </div>
                  <span style={courseBadgeStyle(st.course)}>{st.course||'—'}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px' }}>Phone</div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#1e1b4b', marginTop:2 }}>{st.phone||'—'}</div>
                  </div>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px' }}>Joined</div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#1e1b4b', marginTop:2 }}>{st.date_of_joining||'—'}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => openEdit(st)} style={{ ...s.editBtn, flex:1, justifyContent:'center', padding:'10px' }}>
                    <i className="bi bi-pencil-fill me-2"></i>Edit
                  </button>
                  <button onClick={() => setConfirm(st.id)} style={{ ...s.delBtn, flex:1, justifyContent:'center', padding:'10px' }}>
                    <i className="bi bi-trash-fill me-2"></i>Delete
                  </button>
                </div>
              </div>
            ))}
            <Pagination total={total} perPage={perPage} page={page} setPage={setPage} />
          </>
        )}
      </div>

      {modal && (
        <Modal title={editId ? 'Edit Student' : 'Add Student'} onClose={() => setModal(false)}>
          {modalContent}
        </Modal>
      )}
      {confirm && (
        <Confirm onCancel={() => setConfirm(null)} onConfirm={() => deleteStudent(confirm)} msg="This student record will be permanently removed." />
      )}

      <style>{`
        @media(min-width:769px){ .mgr-mobile{ display:none } .mgr-desktop{ display:block } }
        @media(max-width:768px){ .mgr-desktop{ display:none } .mgr-mobile{ display:block } }
      `}</style>
    </div>
  )
}

export default StudentsMgr