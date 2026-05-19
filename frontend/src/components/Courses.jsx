import { useState } from 'react'

const tabs = [
  { id: 'science',  label: 'Science',  icon: 'bi-activity' },
  { id: 'computer', label: 'Computer', icon: 'bi-cpu' },
  { id: 'commerce', label: 'Commerce', icon: 'bi-graph-up' },
]

const courses = {
  science: [
    { icon: 'bi-activity',    title: 'BSc Physics',      desc: 'Study of energy and matter' },
    { icon: 'bi-droplet',     title: 'BSc Chemistry',    desc: 'Chemical reactions & compounds' },
    { icon: 'bi-bug',         title: 'BSc Zoology',      desc: 'Study of animals & biology' },
    { icon: 'bi-tree',        title: 'BSc Botany',       desc: 'Study of plants' },
    { icon: 'bi-calculator',  title: 'BSc Mathematics',  desc: 'Pure & applied maths' },
    { icon: 'bi-virus',       title: 'BSc Microbiology', desc: 'Study of microorganisms' },
    { icon: 'bi-lightning',   title: 'BSc Electronics',  desc: 'Electronic systems' },
    { icon: 'bi-bar-chart',   title: 'BSc Statistics',   desc: 'Data & probability' },
  ],
  computer: [
    { icon: 'bi-code-slash',  title: 'BCA',                   desc: 'Programming & software dev' },
    { icon: 'bi-cpu',         title: 'BSc Computer Science',  desc: 'Core computing systems' },
    { icon: 'bi-robot',       title: 'BSc AI & ML',           desc: 'Artificial Intelligence' },
    { icon: 'bi-laptop',      title: 'BSc IT',                desc: 'Information Technology' },
    { icon: 'bi-database',    title: 'BSc Data Science',      desc: 'Data analytics & ML' },
    { icon: 'bi-shield-lock', title: 'BSc Cyber Security',    desc: 'Network & cyber security' },
    { icon: 'bi-phone',       title: 'BSc IoT',               desc: 'Internet of Things' },
    { icon: 'bi-cloud',       title: 'BSc Cloud Computing',   desc: 'Cloud platforms & services' },
  ],
  commerce: [
    { icon: 'bi-cash-stack',  title: 'BCom Finance',          desc: 'Accounting & finance' },
    { icon: 'bi-bank',        title: 'BCom Banking',          desc: 'Banking systems' },
    { icon: 'bi-graph-up',    title: 'BCom Marketing',        desc: 'Business marketing' },
    { icon: 'bi-receipt',     title: 'BCom Taxation',         desc: 'Tax systems' },
    { icon: 'bi-people',      title: 'BCom HR',               desc: 'Human resource management' },
    { icon: 'bi-cart',        title: 'BCom E-Commerce',       desc: 'Digital business' },
    { icon: 'bi-pie-chart',   title: 'BCom Business Analytics', desc: 'Business data analysis' },
    { icon: 'bi-briefcase',   title: 'BCom Accounting',       desc: 'Financial accounting' },
  ],
}

function CourseCard({ icon, title, desc }) {
  return (
    <div className="col-6 col-md-3">
      <div className="course-card">
        <div className="c-ico"><i className={`bi ${icon}`}></i></div>
        <h6>{title}</h6>
        <small>{desc}</small><br />
        <span className="c-badge">3 Years</span>
      </div>
    </div>
  )
}

function Courses() {
  const [activeTab, setActiveTab] = useState('science')

  return (
    <section id="courses" className="courses-sec">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-4">
          <div className="sec-badge">Academic Programs</div>
          <h2 className="sec-title">Our Courses</h2>
          <div className="sec-line"></div>
        </div>

        {/* Tabs */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 30,
                border: activeTab === tab.id ? 'none' : '1.5px solid #ccc',
                background: activeTab === tab.id ? 'var(--navy)' : '#fff',
                color: activeTab === tab.id ? '#fff' : 'var(--navy)',
                fontFamily: "'Inter',sans-serif",
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 4px 16px rgba(0,51,102,.25)' : 'none',
                transition: 'all .2s',
              }}
            >
              <i className={`bi ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="row g-3">
          {courses[activeTab].map((course, i) => (
            <CourseCard key={i} {...course} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Courses