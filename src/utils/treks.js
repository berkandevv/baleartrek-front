import { buildApiUrl } from './api'
import { requestJson } from './httpClient'

const TREKS_ENDPOINT = buildApiUrl('/api/treks')
const buildTrekByRegNumberEndpoint = (regNumber) =>
  buildApiUrl(`/api/treks/${encodeURIComponent(regNumber)}`)

export async function fetchTreks() {
  const payload = await requestJson(TREKS_ENDPOINT, undefined, 'No se pudieron cargar las excursiones')
  return payload?.data ?? []
}

export async function fetchTrekByRegNumber(regNumber) {
  const payload = await requestJson(
    buildTrekByRegNumberEndpoint(regNumber),
    undefined,
    `No se pudo cargar la excursión ${regNumber}`,
  )
  return payload?.data ?? null
}

export function sortTreksByAverageScoreDesc(treks = []) {
  return [...treks].sort(
    (a, b) => (Number(b?.score?.average) || 0) - (Number(a?.score?.average) || 0),
  )
}

export function getTopTreksByScore(treks = [], limit = 5) {
  return sortTreksByAverageScoreDesc(treks).slice(0, limit)
}
