import { Link } from 'react-router-dom'

export default function AuthShell({ mode, children }) {
  const isLogin = mode === 'login'

  return (
    <main className="flex-grow flex items-start justify-center px-4 pt-10 pb-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl border border-[#dbe4e6] overflow-hidden">
          <div className="flex border-b border-[#dbe4e6]">
            <Link
              className={`flex-1 py-4 text-sm font-bold border-b-2 text-center transition-colors ${
                isLogin
                  ? 'text-primary border-primary'
                  : 'text-[#618389] hover:text-primary border-transparent'
              }`}
              to="/login"
            >
              Iniciar Sesión
            </Link>
            <Link
              className={`flex-1 py-4 text-sm font-bold border-b-2 text-center transition-colors ${
                isLogin
                  ? 'text-[#618389] hover:text-primary border-transparent'
                  : 'text-primary border-primary'
              }`}
              to="/registro"
            >
              Crear Cuenta
            </Link>
          </div>
          <div className="p-8">{children}</div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-text-muted">
          <span className="material-symbols-outlined text-sm">help</span>
          <p className="text-sm">
            ¿Necesitas ayuda?{' '}
            <Link className="text-primary font-bold hover:underline" to="/contacto">
              Contactar soporte
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
