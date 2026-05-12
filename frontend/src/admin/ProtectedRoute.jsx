import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('adminToken')

  // If no token → redirect to login immediately
  if (!token) {
    return <Navigate to="/portal/login" replace />
  }

  return children
}

export default ProtectedRoute