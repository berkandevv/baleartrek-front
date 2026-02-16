// Muestra un estado consistente de carga/error/aviso en páginas de detalle de trek
export default function TrekDetailsPageState({ message, tone = 'neutral' }) {
  const toneClassNames =
    tone === 'error'
      ? 'bg-rose-50 border-rose-200 text-rose-700'
      : tone === 'warning'
        ? 'bg-amber-50 border-amber-200 text-amber-800'
        : 'bg-white border-[#dbe4e6] text-text-muted'

  return (
    <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-10 py-10">
      <div className={`rounded-xl border p-8 text-center ${toneClassNames}`}>
        <p className="text-sm">{message}</p>
      </div>
    </main>
  )
}
