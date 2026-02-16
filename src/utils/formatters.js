const DEFAULT_STAR_COUNT = 5

// Construye un nombre completo robusto a partir de nombre y apellidos opcionales
export const formatFullName = (person) =>
  `${person?.name ?? ''} ${person?.lastname ?? ''}`.trim()

// Asegura que una puntuación quede entre 0 y el máximo definido
export const clampRating = (score, max = DEFAULT_STAR_COUNT) =>
  Math.max(0, Math.min(max, Math.floor(Number(score) || 0)))
