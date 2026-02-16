import { buildApiUrl } from './api'
import { requestJson } from './httpClient'

const TREKS_ENDPOINT = buildApiUrl('/api/treks')
// Genera el endpoint de detalle codificando el número de registro de la excursión
const buildTrekByRegNumberEndpoint = (regNumber) =>
  buildApiUrl(`/api/treks/${encodeURIComponent(regNumber)}`)

// Recupera el listado de excursiones y devuelve un array seguro
export async function fetchTreks() {
  const payload = await requestJson(TREKS_ENDPOINT, undefined, 'No se pudieron cargar las excursiones')
  return payload?.data ?? []
}

// Obtiene una excursión concreta por número de registro
export async function fetchTrekByRegNumber(regNumber) {
  const payload = await requestJson(
    buildTrekByRegNumberEndpoint(regNumber),
    undefined,
    `No se pudo cargar la excursión ${regNumber}`,
  )
  return payload?.data ?? null
}

// Ordena excursiones por nota media de mayor a menor
export function sortTreksByAverageScoreDesc(treks = []) {
  return [...treks].sort(
    (a, b) => (Number(b?.score?.average) || 0) - (Number(a?.score?.average) || 0),
  )
}

// Devuelve solo las excursiones mejor valoradas según el límite indicado
export function getTopTreksByScore(treks = [], limit = 5) {
  return sortTreksByAverageScoreDesc(treks).slice(0, limit)
}
