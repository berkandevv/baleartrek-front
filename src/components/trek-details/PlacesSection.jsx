import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

const FitMapToMarkers = ({ markers, onReady }) => {
  const map = useMap()

  useEffect(() => {
    if (onReady) {
      onReady(map)
    }
    if (!markers.length) return
    const bounds = markers.map((marker) => [marker.lat, marker.lng])
    map.fitBounds(bounds, { padding: [32, 32] })
  }, [map, markers, onReady])

  useEffect(() => {
    const handleResize = () => map.invalidateSize()
    const timer = setTimeout(() => map.invalidateSize(), 0)
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [map])

  return null
}

export default function PlacesSection({
  mapCenter,
  mapMarkers,
  mapRef,
  handleMapReady,
  defaultIcon,
  markerRefs,
  focusPlaceOnMap,
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
      <div className="lg:col-span-5 lg:sticky lg:top-32">
        <div className="flex items-center gap-3 text-primary mb-6">
          <span className="h-px w-12 bg-primary" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Hitos en el Camino</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Lugares de Interés</h2>
        <p className="text-base md:text-lg text-text-muted leading-relaxed mb-8 font-medium">
          Explora los puntos estratégicos que definen la esencia de la ruta, desde cumbres míticas hasta calas escondidas.
        </p>
        <div className="relative w-full aspect-[4/3] rounded-[1.75rem] bg-gray-100 overflow-hidden shadow-xl border-2 border-white">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={false}
            className="absolute inset-0 h-full w-full"
            ref={mapRef}
          >
            <FitMapToMarkers markers={mapMarkers} onReady={handleMapReady} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapMarkers.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={defaultIcon}
                ref={(marker) => {
                  if (marker) {
                    markerRefs.current[place.id] = marker
                  }
                }}
              >
                <Popup autoPan={false}>
                  <div className="text-sm font-semibold">{place.name}</div>
                  <div className="text-xs text-gray-500">{place.place_type.name}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      <div className="lg:col-span-7 space-y-7">
        {mapMarkers.map((place) => (
          <button
            className="group flex gap-6 p-6 bg-white rounded-[2rem] editorial-shadow border border-transparent hover:border-primary/20 transition-all text-left w-full"
            key={place.id}
            type="button"
            onClick={() => focusPlaceOnMap(place)}
            aria-label={`Enfocar ${place.name} en el mapa`}
          >
            <div className="flex-none size-14 rounded-2xl bg-[#101f22] text-white flex items-center justify-center font-black text-xl group-hover:bg-primary group-hover:text-corporate-blue transition-colors">
              {String(place.order).padStart(2, '0')}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h4 className="text-xl font-black">{place.name}</h4>
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-[0.2em]">
                  {place.place_type.name}
                </span>
              </div>
              <p className="text-base text-text-muted mb-6 leading-relaxed">
                {place.place_type.name} destacado en la ruta, ideal para disfrutar del entorno y descansar.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background-light rounded-lg text-xs font-mono text-primary font-bold">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {place.gps}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
