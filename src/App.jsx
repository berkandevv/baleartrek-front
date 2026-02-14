import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import LoadingPage from './pages/LoadingPage'
import RegisterPage from './pages/RegisterPage'
import TrekDetailsPage from './pages/TrekDetailsPage'
import MeetingDetailsPage from './pages/MeetingDetailsPage'
import ProfilePage from './pages/ProfilePage'
import ProfileCommentsPage from './pages/ProfileCommentsPage'
import { AuthProvider } from './auth/AuthContext.jsx'
import ProtectedRoute from './auth/ProtectedRoute'

function AppContent() {
  return (
    <div className="font-display bg-background-light text-text-main antialiased flex flex-col min-h-screen">
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/login" element={<LoadingPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/treks/:regNumber" element={<TrekDetailsPage />} />
        <Route path="/treks/:regNumber/encuentros/:meetingId" element={<MeetingDetailsPage />} />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/comentarios"
          element={
            <ProtectedRoute>
              <ProfileCommentsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}
