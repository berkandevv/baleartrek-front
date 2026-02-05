export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a className="flex items-center gap-2" href="#">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">hiking</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-text-main dark:text-white">BalearTrek</span>
          </a>
          <nav className="hidden md:flex gap-6 lg:gap-8">
            <a className="text-sm font-semibold text-primary" href="#">Inicio</a>
            <a className="text-sm font-medium text-text-main/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors" href="#">Excursiones</a>
            <a className="text-sm font-medium text-text-main/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors" href="#">Contacto</a>
            <a className="text-sm font-medium text-text-main/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors" href="#">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-[#111718] text-sm font-bold hover:bg-cyan-400 transition-colors">
              Iniciar Sesión / Registro
            </button>
            <button className="md:hidden p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
