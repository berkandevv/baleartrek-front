import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './features/home/pages/HomePage'
import CatalogPage from './features/catalog/pages/CatalogPage'
import FAQPage from './features/content/pages/FAQPage'
import ContactPage from './features/content/pages/ContactPage'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import TrekDetailsPage from './features/trek-details/pages/TrekDetailsPage'
import MeetingDetailsPage from './features/trek-details/pages/MeetingDetailsPage'
import ProfilePage from './features/profile/pages/ProfilePage'
import ProfileCommentsPage from './features/profile/pages/ProfileCommentsPage'
import { AuthProvider } from './features/auth/auth-provider.jsx'
import ProtectedRoute from './features/auth/ProtectedRoute'

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
        <Route path="/login" element={<LoginPage />} />
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
