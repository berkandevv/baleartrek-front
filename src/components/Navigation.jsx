import { Link } from 'react-router-dom'

export default function Navigation({ page, setPage }) {
  return (
    <div className="border-b border-[#f0f4f4] dark:border-gray-800 bg-white dark:bg-card-dark">
      <nav className="max-w-[1440px] mx-auto px-4 md:px-10 h-12 flex items-center gap-6">
        <Link
          to="/"
          className={page === '/' ? 'text-sm font-semibold text-primary' : 'text-sm font-medium text-text-main/80 dark:text-white/80'}
          onClick={() => setPage('/')}
        >
          Inicio
        </Link>
        <Link
          to="/catalogo"
          className={page === '/catalogo' ? 'text-sm font-semibold text-primary' : 'text-sm font-medium text-text-main/80 dark:text-white/80'}
          onClick={() => setPage('/catalogo')}
        >
          Excursiones
        </Link>
      </nav>
    </div>
  )
}
