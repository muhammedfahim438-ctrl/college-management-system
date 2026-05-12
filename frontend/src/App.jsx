import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public Website
import Navbar    from './components/Navbar'
import Carousel  from './components/Carousel'
import Hero      from './components/Hero'
import About     from './components/About'
import Courses   from './components/Courses'
import Gallery   from './components/Gallery'
import Contact   from './components/Contact'
import Footer    from './components/Footer'
import ScrollTop from './components/ScrollTop'

// Admin
import AdminLogin     from './admin/Login'
import AdminApp       from './admin/AdminApp'
import ProtectedRoute from './admin/ProtectedRoute'

// Public single page
function PublicSite() {
  return (
    <>
      <Navbar />
      <Carousel />
      <Hero />
      <About />
      <Courses />
      <Gallery />
      <Contact />
      <Footer />
      <ScrollTop />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicSite />} />

        {/* Admin Routes */}
        <Route path="/portal/login" element={<AdminLogin />} />
        <Route path="/portal/*" element={
          <ProtectedRoute>
            <AdminApp />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App