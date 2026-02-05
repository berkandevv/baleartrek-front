import { Link } from 'react-router-dom'
import fondo from "../img/fondo.png"

export default function Hero() {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-background-light dark:to-background-dark z-10" />
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${fondo})`,
          }}
        />
      </div>
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center gap-6 py-20">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Excursiones mejor valoradas
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md max-w-4xl">
          Descubre las Mejores Experiencias de Senderismo
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
          Explora nuestro Top 5 de excursiones seleccionadas por puntuación media de la comunidad
        </p>
        <div className="mt-4">
          <Link
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-text-main font-bold text-base hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            to="/catalogo"
          >
            Ver Todas las Excursiones
          </Link>
        </div>
      </div>
    </section>
  )
}
