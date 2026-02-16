// Renderiza el pie global con el año actual de copyright
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-sm text-gray-400">© {year} BalearTrek. Todos los derechos reservados.</div>
      </div>
    </footer>
  )
}
