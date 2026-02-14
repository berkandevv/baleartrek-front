import { buildApiUrl } from './api'

const TREKS_ENDPOINT = buildApiUrl('/api/treks')

const toJson = async (response) => response.json().catch(() => ({}))

export async function fetchTreks() {
  const response = await fetch(TREKS_ENDPOINT)
  const payload = await toJson(response)

  if (!response.ok) {
    throw new Error(payload?.message || 'No se pudieron cargar las excursiones')
  }

  return payload?.data ?? []
}

export function sortTreksByAverageScoreDesc(treks = []) {
  return [...treks].sort(
    (a, b) => (Number(b?.score?.average) || 0) - (Number(a?.score?.average) || 0),
  )
}

export function getTopTreksByScore(treks = [], limit = 5) {
  return sortTreksByAverageScoreDesc(treks).slice(0, limit)
}
