// Convierte coordenadas "lat,lng" en números válidos
export const parseGpsCoordinates = (gps) => {
  if (typeof gps !== 'string' || !gps.includes(',')) return null
  const [latRaw, lngRaw] = gps.split(',').map((value) => value.trim())
  const lat = Number(latRaw)
  const lng = Number(lngRaw)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

// Enriquece lugares con lat/lng y descarta coordenadas inválidas
export const buildMapMarkers = (places = []) =>
  places
    .map((place) => {
      const coordinates = parseGpsCoordinates(place?.gps)
      if (!coordinates) return null
      return { ...place, ...coordinates }
    })
    .filter(Boolean)

// Calcula el centro promedio de los marcadores o usa fallback balear
export const getMapCenter = (mapMarkers = []) =>
  mapMarkers.length
    ? [
        mapMarkers.reduce((sum, place) => sum + place.lat, 0) / mapMarkers.length,
        mapMarkers.reduce((sum, place) => sum + place.lng, 0) / mapMarkers.length,
      ]
    : [39.6, 2.9]
