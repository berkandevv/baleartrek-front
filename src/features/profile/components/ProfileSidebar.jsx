import { NavLink } from 'react-router-dom'

// Muestra el panel lateral del perfil con resumen del usuario y navegación interna
export default function ProfileSidebar({ fullName, memberSince }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8">
      <div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-[#f0f4f4]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h1 className="text-text-main text-lg font-bold leading-normal">
              {fullName || 'Perfil'}
            </h1>
            <p className="text-text-sub text-sm font-normal leading-normal">
              {memberSince ? `Miembro desde ${memberSince}` : 'Cuenta de BalearTrek'}
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/perfil"
            end
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20'
                : 'flex items-center gap-3 px-3 py-2 rounded-lg text-text-sub hover:bg-[#f0f4f4] transition-colors'
            }
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-semibold leading-normal">Mis Datos</span>
          </NavLink>
          <NavLink
            to="/perfil/comentarios"
            end
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20'
                : 'flex items-center gap-3 px-3 py-2 rounded-lg text-text-sub hover:bg-[#f0f4f4] transition-colors'
            }
          >
            <span className="material-symbols-outlined">explore</span>
            <span className="text-sm font-semibold leading-normal">Mis Encuentros</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  )
}
