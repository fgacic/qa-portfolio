type MaplibreModule = typeof import('maplibre-gl')
type GeoJson = GeoJSON.GeoJSON

const GEOJSON_LOW_URL = '/data/countries-110m.geo.json'
const GEOJSON_HIGH_URL = '/data/countries-50m.geo.json'

let maplibreModule: MaplibreModule | null = null
let maplibreLoad: Promise<MaplibreModule> | null = null
let geoLow: GeoJson | null = null
let geoLowLoad: Promise<GeoJson> | null = null
let geoHigh: GeoJson | null = null
let geoHighLoad: Promise<GeoJson> | null = null

export function preloadGlobeAssets(): void {
  if (typeof window === 'undefined') return

  maplibreLoad ??= import('maplibre-gl').then((mod) => {
    maplibreModule = mod
    return mod
  })

  geoLowLoad ??= fetch(GEOJSON_LOW_URL)
    .then((res) => res.json())
    .then((data: GeoJson) => {
      geoLow = data
      return data
    })

  geoHighLoad ??= fetch(GEOJSON_HIGH_URL)
    .then((res) => res.json())
    .then((data: GeoJson) => {
      geoHigh = data
      return data
    })
}

export async function loadMaplibre(): Promise<MaplibreModule> {
  preloadGlobeAssets()
  if (maplibreModule) return maplibreModule
  return maplibreLoad!
}

export async function loadMaplibreGl(): Promise<MaplibreModule['default']> {
  const mod = await loadMaplibre()
  return mod.default
}

export async function loadGeoJsonLow(): Promise<GeoJson> {
  preloadGlobeAssets()
  if (geoLow) return geoLow
  return geoLowLoad!
}

export async function loadGeoJsonHigh(): Promise<GeoJson> {
  preloadGlobeAssets()
  if (geoHigh) return geoHigh
  return geoHighLoad!
}
