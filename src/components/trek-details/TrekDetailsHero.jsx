import { resolveImageUrl } from '../../utils/urls'

export default function TrekDetailsHero({ trek }) {
  const averageScore = Number(trek.score.average)
  const scoreCount = trek.score.count
  const scoreLabel = averageScore.toFixed(2)
  const imageSrc = resolveImageUrl(trek.imageUrl)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] text-[#111718] dark:text-white">
          {trek.name}
        </h1>
        <div className="flex flex-col items-end flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
            <span className="material-symbols-outlined text-yellow-500 fill-1 text-xl">star</span>
            <span className="text-xl font-bold text-[#111718] dark:text-white">{scoreLabel}</span>
            <span className="text-xs font-medium text-[#618389] uppercase ml-1 tracking-wide">
              {scoreCount} valoraciones
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden h-[400px] w-full relative group shadow-md bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          alt={trek.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={imageSrc}
        />
      </div>
    </div>
  )
}
