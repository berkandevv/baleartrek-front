const DEFAULT_MAX = 5

export default function Stars({
  rating = 0,
  id = 'stars',
  max = DEFAULT_MAX,
  className = 'text-[16px] leading-none',
  filledClassName = 'text-yellow-500',
  emptyClassName = 'text-gray-300 dark:text-gray-600',
}) {
  const safeRating = Math.max(0, Math.min(max, Number(rating) || 0))
  const items = []

  for (let index = 0; index < max; index += 1) {
    const isFilled = index < safeRating
    items.push(
      <span
        className={`${className} ${isFilled ? filledClassName : emptyClassName}`}
        key={`${id}-star-${index}`}
        aria-hidden="true"
      >
        {isFilled ? '★' : '☆'}
      </span>
    )
  }

  return (
    <div className="flex" aria-label={`Valoración ${safeRating} de ${max}`}>
      {items}
    </div>
  )
}
