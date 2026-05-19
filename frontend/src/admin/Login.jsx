import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'

// Helper to get CSRF cookie
function getCsrf() {
  return document.cookie.match(/csrftoken=([^;]+)/)?.[1] || ''
}

function AdminLogin() {
  const [step, setStep]       = useState('login') // 'login' | 'otp'
  const [form, setForm]       = useState({ username: '', password: '', otp: '' })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  // Step 1 — Submit username + password → sends OTP
  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/college-admin/api/send-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrf(),
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStep('otp')
        setSuccess('OTP sent to your registered email!')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Server error. Please try again.')
    }
    setLoading(false)
  }

  // Step 2 — Submit OTP → verify and get JWT token
  const handleOtp = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/college-admin/api/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrf(),
        },
        body: JSON.stringify({
          username: form.username,
          otp: form.otp,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        // Now get JWT token using api/login
        const tokenRes = await fetch('/api/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        })
        const tokenData = await tokenRes.json()
        if (tokenRes.ok) {
          sessionStorage.setItem('adminToken',    tokenData.access)
          sessionStorage.setItem('adminUsername', form.username)
          navigate('/portal/dashboard')
        } else {
          setError('Login failed after OTP. Please try again.')
        }
      } else {
        setError(data.error || 'Invalid OTP')
      }
    } catch {
      setError('Server error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#1a1f2e 0%,#2d3748 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI',sans-serif", padding: 16
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '40px 32px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,.35)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 14px'
          }}>🎓</div>
          <h2 style={{
            fontFamily: "'Segoe UI',sans-serif", fontSize: '1.4rem',
            fontWeight: 700, color: '#1a202c', margin: 0
          }}>
            {step === 'login' ? 'Admin Login' : 'Verify OTP'}
          </h2>
          <p style={{ color: '#718096', fontSize: 13, marginTop: 4 }}>
            {step === 'login'
              ? 'University Arts & Science College'
              : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {/* Success */}
        {success && (
          <div style={{
            background: '#f0fff4', border: '1.5px solid #9ae6b4',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            color: '#276749', fontSize: 13, textAlign: 'center'
          }}>
            ✅ {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff5f5', border: '1.5px solid #feb2b2',
            borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            color: '#c53030', fontSize: 13, textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Login Form */}
        {step === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lblStyle}>Username</label>
              <input
                type="text" name="username"
                style={inputStyle}
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            <div>
              <label style={lblStyle}>Password</label>
              <input
                type="password" name="password"
                style={inputStyle}
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            <button onClick={handleLogin} disabled={loading} style={btnStyle}>
              {loading
                ? '⏳ Sending OTP...'
                : '🔐 Login & Send OTP'}
            </button>
          </div>
        )}

        {/* OTP Form */}
        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lblStyle}>Enter 6-digit OTP</label>
              <input
                type="text" name="otp"
                style={{ ...inputStyle, fontSize: 22, letterSpacing: 8, textAlign: 'center' }}
                placeholder="• • • • • •"
                value={form.otp}
                onChange={handleChange}
                maxLength={6}
                autoFocus
              />
            </div>
            <button onClick={handleOtp} disabled={loading} style={btnStyle}>
              {loading ? '⏳ Verifying...' : '✅ Verify OTP'}
            </button>
            <button
              onClick={() => { setStep('login'); setError(''); setSuccess('') }}
              style={{ ...btnStyle, background: '#e2e8f0', color: '#4a5568' }}
            >
              ← Back to Login
            </button>
          </div>
        )}

        {/* Back to website */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ color: '#6366f1', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  )
}

const lblStyle = {
  fontSize: 12, fontWeight: 700, color: '#4a5568',
  textTransform: 'uppercase', letterSpacing: '.5px',
  display: 'block', marginBottom: 6
}
const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #e2e8f0', borderRadius: 10,
  fontSize: 14, color: '#2d3748', outline: 'none',
  background: '#f8fafc', fontFamily: "'Segoe UI',sans-serif",
  boxSizing: 'border-box'
}
const btnStyle = {
  background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
  color: '#fff', border: 'none', borderRadius: 12,
  padding: '13px', fontFamily: "'Segoe UI',sans-serif",
  fontWeight: 700, fontSize: 14, cursor: 'pointer',
  marginTop: 4, width: '100%'
}

export default AdminLogin