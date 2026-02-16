import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

export default function Header() {
  const { pathname } = useLocation()
  const isCatalogPage = pathname === '/catalogo'
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { isAuthenticated, logout, isLoading, user } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleSearchChange = (event) => {
    const value = event.target.value
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center gap-2" to="/">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">hiking</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-text-main">BalearTrek</span>
          </Link>

          {isCatalogPage ? (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <label className="flex flex-col w-full h-10">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden border border-[#dbe4e6] focus-within:border-primary">
                  <div className="text-text-sub flex bg-[#f0f4f4] items-center justify-center pl-4 pr-2">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                  <input
                    value={query}
                    onChange={handleSearchChange}
                    className="flex w-full min-w-0 flex-1 resize-none bg-[#f0f4f4] text-text-main focus:outline-0 border-none h-full placeholder:text-text-sub px-2 text-sm"
                    placeholder="Buscar excursiones..."
                  />
                </div>
              </label>
            </div>
          ) : null}

          <div className="hidden md:flex items-center gap-6">
            <nav className="hidden md:flex gap-6 lg:gap-8">
              <Link className={`text-sm ${pathname === '/' ? 'font-semibold text-primary' : 'font-medium text-text-main/80 hover:text-primary transition-colors'}`} to="/">
                Inicio
              </Link>
              <Link className={`text-sm ${pathname === '/catalogo' ? 'font-semibold text-primary' : 'font-medium text-text-main/80 hover:text-primary transition-colors'}`} to="/catalogo">
                Excursiones
              </Link>
              <Link className={`text-sm ${pathname === '/contacto' ? 'font-semibold text-primary' : 'font-medium text-text-main/80 hover:text-primary transition-colors'}`} to="/contacto">
                Contacto
              </Link>
              <Link className={`text-sm ${pathname === '/faq' ? 'font-semibold text-primary' : 'font-medium text-text-main/80 hover:text-primary transition-colors'}`} to="/faq">
                FAQ
              </Link>
            </nav>
            {isAuthenticated ? (
              <div
                className="relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsProfileMenuOpen(false)
                  }
                }}
              >
                <button
                  className="flex items-center gap-3 pl-2 pr-3 py-1.5 h-10 rounded-lg bg-primary text-[#111718] hover:bg-cyan-400 transition-all group"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                  aria-controls="profile-menu"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <div className="size-8 rounded-full border border-primary/20 bg-white/80 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-text-main">person</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-text-main uppercase tracking-tight">
                      {user?.name ? user.name : 'Mi cuenta'}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-text-main/70 group-hover:text-text-main transition-colors">
                      expand_more
                    </span>
                  </div>
                </button>

                {isProfileMenuOpen ? (
                  <div
                    id="profile-menu"
                    role="menu"
                    className="absolute left-0 mt-2 w-full min-w-[200px] rounded-xl border border-primary/40 bg-white shadow-lg shadow-[0_12px_28px_-20px_rgba(34,193,231,0.9)] p-2 flex flex-col gap-2"
                  >
                    <Link
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-primary text-[#111718] hover:bg-cyan-400 transition-colors"
                      to="/perfil"
                      role="menuitem"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#111718]/70">
                        account_circle
                      </span>
                      Mi perfil
                    </Link>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-primary text-[#111718] hover:bg-cyan-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      onClick={logout}
                      type="button"
                      disabled={isLoading}
                      role="menuitem"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#111718]/70">
                        logout
                      </span>
                      {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-[#111718] text-sm font-bold hover:bg-cyan-400 transition-colors"
                to="/login"
              >
                Iniciar Sesión / Registro
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
