import { useState } from 'react'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contacts/', {   // ← not /api/contacts/add/, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
        setForm({ name: '', email: '', subject: '', message: '' })
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err) {
      console.error('Contact form error:', err)
    }
    setLoading(false)
  }

  const contactInfo = [
    { icon: 'bi-geo-alt-fill',   label: 'Address',           value: 'Palakkad, Kerala, India',          href: null },
    { icon: 'bi-telephone-fill', label: 'Phone (tap to call)', value: '0491 2527770',                   href: 'tel:04912527770' },
    { icon: 'bi-envelope-fill',  label: 'Email (tap to mail)', value: 'universitycollegepkd@university.com', href: 'mailto:universitycollegepkd@university.com' },
    { icon: 'bi-clock-fill',     label: 'Office Hours',       value: 'Mon – Sat: 9:00 AM – 5:00 PM',   href: null },
  ]

  return (
    <section id="contact" className="contact-sec">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-4">
          <div className="sec-badge">Get in Touch</div>
          <h2 className="sec-title">Contact Us</h2>
          <div className="sec-line"></div>
        </div>

        {/* Success Message */}
        {success && (
          <div
            className="alert alert-success rounded-3 mb-4 text-center fw-bold"
            style={{ maxWidth: 700, margin: '0 auto 20px' }}
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            Message sent successfully! We will get back to you soon.
          </div>
        )}

        <div className="row g-4 align-items-start justify-content-center">

          {/* ── Contact Info ── */}
          <div className="col-lg-4">
            <h5 style={{ color: 'var(--dark)', fontFamily: "'Playfair Display',serif", marginBottom: 16 }}>
              Reach Out To Us
            </h5>
            {contactInfo.map((item, i) => (
              <div className="ci-item" key={i}>
                {item.href ? (
                  <a href={item.href} style={{ textDecoration: 'none', display: 'contents' }}>
                    <div className="ci-ico"><i className={`bi ${item.icon}`}></i></div>
                    <div>
                      <div className="ci-lbl">{item.label}</div>
                      <div className="ci-val">{item.value}</div>
                    </div>
                  </a>
                ) : (
                  <>
                    <div className="ci-ico"><i className={`bi ${item.icon}`}></i></div>
                    <div>
                      <div className="ci-lbl">{item.label}</div>
                      <div className="ci-val">{item.value}</div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* ── Contact Form ── */}
          <div className="col-lg-7">
            <div className="contact-card">
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <button
                   className="btn-send"
                   onClick={handleSubmit}
                   disabled={loading}
                  >
                    {loading
                      ? <><i className="bi bi-hourglass-split"></i> Sending...</>
                      : <><i className="bi bi-send-fill"></i> Send Message</>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Contact