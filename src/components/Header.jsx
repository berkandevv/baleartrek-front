import { Link, useLocation, useSearchParams } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()
  const isCatalogPage = pathname === '/catalogo'
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const handleSearchChange = (event) => {
    const value = event.target.value
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center gap-2" to="/">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">hiking</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-text-main dark:text-white">BalearTrek</span>
          </Link>

          {isCatalogPage ? (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <label className="flex flex-col w-full h-10">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden border border-[#dbe4e6] dark:border-gray-700 focus-within:border-primary">
                  <div className="text-text-sub flex bg-[#f0f4f4] dark:bg-gray-800 items-center justify-center pl-4 pr-2">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </div>
                  <input
                    value={query}
                    onChange={handleSearchChange}
                    className="flex w-full min-w-0 flex-1 resize-none bg-[#f0f4f4] dark:bg-gray-800 text-text-main dark:text-white focus:outline-0 border-none h-full placeholder:text-text-sub px-2 text-sm"
                    placeholder="Buscar excursiones..."
                  />
                </div>
              </label>
            </div>
          ) : null}

          <div className="hidden md:flex items-center gap-6">
            <nav className="hidden md:flex gap-6 lg:gap-8">
              <Link className={`text-sm ${pathname === '/' ? 'font-semibold text-primary' : 'font-medium text-text-main/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors'}`} to="/">
                Inicio
              </Link>
              <Link className={`text-sm ${pathname === '/catalogo' ? 'font-semibold text-primary' : 'font-medium text-text-main/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors'}`} to="/catalogo">
                Excursiones
              </Link>
              <Link className={`text-sm ${pathname === '/contacto' ? 'font-semibold text-primary' : 'font-medium text-text-main/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors'}`} to="/contacto">
                Contacto
              </Link>
              <Link className={`text-sm ${pathname === '/faq' ? 'font-semibold text-primary' : 'font-medium text-text-main/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors'}`} to="/faq">
                FAQ
              </Link>
            </nav>
            <Link
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-[#111718] text-sm font-bold hover:bg-cyan-400 transition-colors"
              to="/login"
            >
              Iniciar Sesión / Registro
            </Link>
          </div>

          <button className="md:hidden p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" type="button">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  )
}
