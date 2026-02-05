import { Outlet } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'

export default function AppLayout() {
  return (
    // Estructura base compartida por las páginas
    <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white antialiased flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
