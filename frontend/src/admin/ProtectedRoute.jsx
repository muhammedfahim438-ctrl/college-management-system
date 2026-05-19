import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token    = sessionStorage.getItem('adminToken')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return

    // Push login into history so back button goes to login
    window.history.pushState(null, '', window.location.href)

    // Block browser back/forward buttons
    const blockNav = () => {
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', blockNav)

    // Clear token when tab closes or navigates away
    const clearToken = () => {
      sessionStorage.removeItem('adminToken')
      sessionStorage.removeItem('adminUsername')
    }
    window.addEventListener('beforeunload', clearToken)

    return () => {
      window.removeEventListener('popstate', blockNav)
      window.removeEventListener('beforeunload', clearToken)
    }
  }, [token])

  // No token → always go to login
  if (!token) {
    return <Navigate to="/portal/login" replace />
  }

  return children
}

export default ProtectedRoute