'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Project } from '@/lib/projects'
import 'maplibre-gl/dist/maplibre-gl.css'

const ISO_KEY = 'ISO_A3'
const GEOJSON_LOW_URL = '/data/countries-110m.geo.json'
const GEOJSON_HIGH_URL = '/data/countries-50m.geo.json'
const ROTATION_DEG_PER_SEC = 6
const GLOBE_CENTER: [number, number] = [10, 20]
const GLOBE_ZOOM = 2
const MY_LOCATION_ISO = 'HRV'
const MY_LOCATION_LABEL = 'My location'
const MY_LOCATION_COORDS: [number, number] = [16.4402, 43.5081]
const MY_LOCATION_ACCENT = '#e8e6f0'
const COUNTRIES_LOW_SOURCE = 'countries-low'
const COUNTRIES_HIGH_SOURCE = 'countries-high'
const FILL_ALL_LAYER = 'countries-fill-all'
const FILL_HIGHLIGHT_LAYER = 'countries-fill-highlight'
const FILL_HOME_LAYER = 'countries-fill-home'
const OUTLINE_HIGHLIGHT_LAYER = 'countries-outline-highlight'
const OUTLINE_HOME_LAYER = 'countries-outline-home'
const HOME_MARKER_SOURCE = 'home-marker'
const HOME_MARKER_GLOW_LAYER = 'home-marker-glow'
const HOME_MARKER_DOT_LAYER = 'home-marker-dot'
const HIT_PROJECT_LAYER = 'countries-hit-project'
const HIT_HOME_LAYER = 'countries-hit-home'

export type ProjectCountry = {
  iso: string
  projectId: string
  projectName: string
  accent: string
}

interface GlobeProps {
  projects: Project[]
  projectIdOf: (p: Project) => string
  hoveredProjectId: string | null
  onCountryHover: (projectId: string | null) => void
  onCountryClick: (projectId: string) => void
}

export default function Globe({
  projects,
  projectIdOf,
  hoveredProjectId,
  onCountryHover,
  onCountryClick,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<import('maplibre-gl').Map | null>(null)
  const popupRef = useRef<import('maplibre-gl').Popup | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number | null>(null)
  const pausedRef = useRef<boolean>(false)
  const hoveredFeatureIdRef = useRef<string | number | null>(null)
  const externalHoveredIsoRef = useRef<string | null>(null)
  const onCountryHoverRef = useRef(onCountryHover)
  const onCountryClickRef = useRef(onCountryClick)
  const [shouldMount, setShouldMount] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const countryMap = useMemo(() => {
    const map = new Map<string, ProjectCountry>()
    projects.forEach((p) => {
      p.countries.forEach((iso) => {
        map.set(iso, {
          iso,
          projectId: projectIdOf(p),
          projectName: p.name,
          accent: p.accent,
        })
      })
    })
    return map
  }, [projects, projectIdOf])

  useEffect(() => {
    onCountryHoverRef.current = onCountryHover
    onCountryClickRef.current = onCountryClick
  }, [onCountryHover, onCountryClick])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || shouldMount) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMount(true)
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shouldMount])

  useEffect(() => {
    if (!shouldMount || !containerRef.current) return
    let cancelled = false
    let cleanup: (() => void) | null = null
    let hoverClearTimer: ReturnType<typeof setTimeout> | null = null

    ;(async () => {
      const maplibregl = (await import('maplibre-gl')).default
      if (cancelled || !containerRef.current) return

      const highlightCases: unknown[] = ['case']
      countryMap.forEach((info) => {
        highlightCases.push(['==', ['get', ISO_KEY], info.iso])
        highlightCases.push(info.accent)
      })
      highlightCases.push('transparent')
      const highlightExpr = highlightCases as maplibregl.ExpressionSpecification

      const showHomePopup = (map: import('maplibre-gl').Map, lngLat: import('maplibre-gl').LngLatLike) => {
        popup
          .setLngLat(lngLat)
          .setHTML(
            `<div style="padding:0.35rem 0.6rem;text-align:center;">
              <div style="font-size:0.62rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:rgba(232,230,240,0.55);margin-bottom:0.15rem;">Based in</div>
              <div style="font-size:0.8rem;font-weight:600;color:${MY_LOCATION_ACCENT};">${MY_LOCATION_LABEL}</div>
            </div>`,
          )
          .addTo(map)
      }

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: {
          version: 8,
          projection: { type: 'globe' },
          sources: {},
          layers: [
            {
              id: 'background',
              type: 'background',
              paint: { 'background-color': '#0a0a0c' },
            },
          ],
        } as maplibregl.StyleSpecification,
        center: GLOBE_CENTER,
        zoom: GLOBE_ZOOM,
        canvasContextAttributes: { antialias: true },
        attributionControl: false,
        interactive: true,
        dragRotate: !isMobile,
        dragPan: !isMobile,
        scrollZoom: true,
        touchZoomRotate: !isMobile,
        keyboard: false,
        doubleClickZoom: false,
        boxZoom: false,
      })
      mapRef.current = map

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
        className: 'globe-popup',
      })
      popupRef.current = popup

      map.on('load', () => {
        if (cancelled) return

        map.addSource(COUNTRIES_LOW_SOURCE, {
          type: 'geojson',
          data: GEOJSON_LOW_URL,
          promoteId: ISO_KEY,
        })

        map.addSource(COUNTRIES_HIGH_SOURCE, {
          type: 'geojson',
          data: GEOJSON_HIGH_URL,
          promoteId: ISO_KEY,
          tolerance: 0,
        })

        map.addLayer({
          id: FILL_ALL_LAYER,
          type: 'fill',
          source: COUNTRIES_LOW_SOURCE,
          paint: {
            'fill-color': 'rgba(255,255,255,0.04)',
            'fill-antialias': true,
          },
        })

        map.addLayer({
          id: FILL_HIGHLIGHT_LAYER,
          type: 'fill',
          source: COUNTRIES_HIGH_SOURCE,
          filter: [
            'in',
            ['get', ISO_KEY],
            ['literal', Array.from(countryMap.keys())],
          ],
          paint: {
            'fill-color': highlightExpr,
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.85,
              0.45,
            ],
            'fill-antialias': true,
          },
        })

        map.addLayer({
          id: OUTLINE_HIGHLIGHT_LAYER,
          type: 'line',
          source: COUNTRIES_HIGH_SOURCE,
          filter: [
            'in',
            ['get', ISO_KEY],
            ['literal', Array.from(countryMap.keys())],
          ],
          paint: {
            'line-color': highlightExpr,
            'line-width': 1,
            'line-opacity': 0.7,
          },
        })

        map.addLayer({
          id: FILL_HOME_LAYER,
          type: 'fill',
          source: COUNTRIES_HIGH_SOURCE,
          filter: ['==', ['get', ISO_KEY], MY_LOCATION_ISO],
          paint: {
            'fill-color': MY_LOCATION_ACCENT,
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.35,
              0.18,
            ],
            'fill-antialias': true,
          },
        })

        map.addLayer({
          id: OUTLINE_HOME_LAYER,
          type: 'line',
          source: COUNTRIES_HIGH_SOURCE,
          filter: ['==', ['get', ISO_KEY], MY_LOCATION_ISO],
          paint: {
            'line-color': MY_LOCATION_ACCENT,
            'line-width': 1.5,
            'line-opacity': 0.85,
          },
        })

        map.addSource(HOME_MARKER_SOURCE, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: MY_LOCATION_COORDS },
            properties: { id: 'home' },
          },
          promoteId: 'id',
        })

        map.addLayer({
          id: HOME_MARKER_GLOW_LAYER,
          type: 'circle',
          source: HOME_MARKER_SOURCE,
          layout: {
            'circle-pitch-alignment': 'map',
          },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              10,
              4,
              16,
              8,
              22,
            ],
            'circle-color': MY_LOCATION_ACCENT,
            'circle-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.35,
              0.22,
            ],
            'circle-blur': 0.55,
          },
        })

        map.addLayer({
          id: HOME_MARKER_DOT_LAYER,
          type: 'circle',
          source: HOME_MARKER_SOURCE,
          layout: {
            'circle-pitch-alignment': 'map',
          },
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              4,
              4,
              7,
              8,
              10,
            ],
            'circle-color': MY_LOCATION_ACCENT,
            'circle-opacity': 1,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'rgba(10,10,12,0.9)',
          },
        })

        map.addLayer({
          id: HIT_PROJECT_LAYER,
          type: 'fill',
          source: COUNTRIES_LOW_SOURCE,
          filter: [
            'in',
            ['get', ISO_KEY],
            ['literal', Array.from(countryMap.keys())],
          ],
          paint: {
            'fill-color': '#000',
            'fill-opacity': 0.01,
          },
        })

        map.addLayer({
          id: HIT_HOME_LAYER,
          type: 'fill',
          source: COUNTRIES_LOW_SOURCE,
          filter: ['==', ['get', ISO_KEY], MY_LOCATION_ISO],
          paint: {
            'fill-color': '#000',
            'fill-opacity': 0.01,
          },
        })

        if (externalHoveredIsoRef.current) {
          map.setFeatureState(
            { source: COUNTRIES_HIGH_SOURCE, id: externalHoveredIsoRef.current },
            { hover: true },
          )
        }

        map.resize()

        const clearProjectHover = () => {
          if (
            hoveredFeatureIdRef.current &&
            hoveredFeatureIdRef.current !== externalHoveredIsoRef.current
          ) {
            map.setFeatureState(
              { source: COUNTRIES_HIGH_SOURCE, id: hoveredFeatureIdRef.current },
              { hover: false },
            )
          }
          hoveredFeatureIdRef.current = null
          onCountryHoverRef.current(null)
        }

        const setHomeHover = (active: boolean) => {
          map.setFeatureState(
            { source: COUNTRIES_HIGH_SOURCE, id: MY_LOCATION_ISO },
            { hover: active },
          )
          map.setFeatureState(
            { source: HOME_MARKER_SOURCE, id: 'home' },
            { hover: active },
          )
        }

        const clearAllHover = () => {
          map.getCanvas().style.cursor = 'default'
          clearProjectHover()
          setHomeHover(false)
          popup.remove()
        }

        const scheduleHoverClear = () => {
          if (hoverClearTimer) clearTimeout(hoverClearTimer)
          hoverClearTimer = setTimeout(() => {
            hoverClearTimer = null
            clearAllHover()
          }, 40)
        }

        const cancelHoverClear = () => {
          if (hoverClearTimer) {
            clearTimeout(hoverClearTimer)
            hoverClearTimer = null
          }
        }

        const applyProjectHover = (
          iso: string,
          info: ProjectCountry,
          lngLat: import('maplibre-gl').LngLatLike,
        ) => {
          cancelHoverClear()
          setHomeHover(false)
          map.getCanvas().style.cursor = 'pointer'

          if (hoveredFeatureIdRef.current && hoveredFeatureIdRef.current !== iso) {
            map.setFeatureState(
              { source: COUNTRIES_HIGH_SOURCE, id: hoveredFeatureIdRef.current },
              { hover: false },
            )
          }
          hoveredFeatureIdRef.current = iso
          map.setFeatureState({ source: COUNTRIES_HIGH_SOURCE, id: iso }, { hover: true })

          popup
            .setLngLat(lngLat)
            .setHTML(
              `<div style="font-size:0.78rem;font-weight:500;color:#e8e6f0;padding:0.25rem 0.5rem;">${info.projectName}</div>`,
            )
            .addTo(map)

          onCountryHoverRef.current(info.projectId)
        }

        const applyHomeHover = (lngLat: import('maplibre-gl').LngLatLike) => {
          cancelHoverClear()
          clearProjectHover()
          map.getCanvas().style.cursor = 'default'
          setHomeHover(true)
          showHomePopup(map, lngLat)
        }

        const bindProjectPointer = (layerId: string) => {
          map.on('mousemove', layerId, (e) => {
            if (!e.features || e.features.length === 0) return
            const iso = e.features[0].properties?.[ISO_KEY] as string | undefined
            if (!iso) return
            const info = countryMap.get(iso)
            if (!info) return
            applyProjectHover(iso, info, e.lngLat)
          })

          map.on('mouseleave', layerId, scheduleHoverClear)

          map.on('click', layerId, (e) => {
            if (!e.features || e.features.length === 0) return
            const iso = e.features[0].properties?.[ISO_KEY] as string | undefined
            if (!iso) return
            const info = countryMap.get(iso)
            if (info) onCountryClickRef.current(info.projectId)
          })
        }

        const bindHomePointer = (layerId: string) => {
          map.on('mousemove', layerId, (e) => {
            applyHomeHover(e.lngLat)
          })

          map.on('mouseleave', layerId, scheduleHoverClear)

          map.on('click', layerId, (e) => {
            showHomePopup(map, e.lngLat)
          })
        }

        if (!isMobile) {
          bindProjectPointer(FILL_HIGHLIGHT_LAYER)
          bindProjectPointer(HIT_PROJECT_LAYER)
          bindHomePointer(FILL_HOME_LAYER)
          bindHomePointer(HIT_HOME_LAYER)
          bindHomePointer(HOME_MARKER_DOT_LAYER)
          bindHomePointer(HOME_MARKER_GLOW_LAYER)
          map.on('mouseleave', clearAllHover)
        } else {
          map.on('click', FILL_HIGHLIGHT_LAYER, (e) => {
            if (!e.features || e.features.length === 0) return
            const iso = e.features[0].properties?.[ISO_KEY] as string | undefined
            if (!iso) return
            const info = countryMap.get(iso)
            if (info) onCountryClickRef.current(info.projectId)
          })
          map.on('click', HIT_PROJECT_LAYER, (e) => {
            if (!e.features || e.features.length === 0) return
            const iso = e.features[0].properties?.[ISO_KEY] as string | undefined
            if (!iso) return
            const info = countryMap.get(iso)
            if (info) onCountryClickRef.current(info.projectId)
          })
          map.on('click', FILL_HOME_LAYER, (e) => {
            showHomePopup(map, e.lngLat)
          })
          map.on('click', HIT_HOME_LAYER, (e) => {
            showHomePopup(map, e.lngLat)
          })
          map.on('click', HOME_MARKER_DOT_LAYER, (e) => {
            showHomePopup(map, e.lngLat)
          })
        }

        const tick = (t: number) => {
          if (!mapRef.current) return
          if (lastFrameRef.current == null) lastFrameRef.current = t
          const dt = (t - lastFrameRef.current) / 1000
          lastFrameRef.current = t
          if (!pausedRef.current) {
            const current = mapRef.current.getCenter()
            const newLng = ((current.lng + ROTATION_DEG_PER_SEC * dt + 540) % 360) - 180
            mapRef.current.setCenter([newLng, current.lat])
          }
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      })

      const canvasEl = map.getCanvasContainer()
      const onEnter = () => {
        pausedRef.current = true
      }
      const onLeave = () => {
        pausedRef.current = false
      }
      const onDragStart = () => {
        pausedRef.current = true
      }
      const onDragEnd = () => {
        if (!canvasEl.matches(':hover')) pausedRef.current = false
      }
      canvasEl.addEventListener('mouseenter', onEnter)
      canvasEl.addEventListener('mouseleave', onLeave)
      map.on('dragstart', onDragStart)
      map.on('dragend', onDragEnd)

      cleanup = () => {
        canvasEl.removeEventListener('mouseenter', onEnter)
        canvasEl.removeEventListener('mouseleave', onLeave)
        if (hoverClearTimer) clearTimeout(hoverClearTimer)
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        lastFrameRef.current = null
        popup.remove()
        popupRef.current = null
        map.remove()
        mapRef.current = null
      }
    })()

    return () => {
      cancelled = true
      if (cleanup) cleanup()
    }
  }, [shouldMount, isMobile, countryMap])

  useEffect(() => {
    const map = mapRef.current
    const prev = externalHoveredIsoRef.current
    const next: string | null = (() => {
      if (!hoveredProjectId) return null
      for (const [iso, info] of countryMap.entries()) {
        if (info.projectId === hoveredProjectId) return iso
      }
      return null
    })()
    externalHoveredIsoRef.current = next

    if (!map || !map.isStyleLoaded()) return
    if (prev && prev !== next && prev !== hoveredFeatureIdRef.current) {
      map.setFeatureState(
        { source: COUNTRIES_HIGH_SOURCE, id: prev },
        { hover: false },
      )
    }
    if (next) {
      map.setFeatureState(
        { source: COUNTRIES_HIGH_SOURCE, id: next },
        { hover: true },
      )
    }
  }, [hoveredProjectId, countryMap])

  return (
    <div
      ref={containerRef}
      className="globe-canvas"
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: isMobile ? '280px' : '600px',
        margin: isMobile ? '0 auto 2rem' : '0',
        borderRadius: '50%',
        overflow: 'hidden',
        background: '#0a0a0c',
        boxShadow:
          '0 0 0 1px rgba(255,255,255,0.05), 0 30px 80px -20px rgba(99,102,241,0.18)',
      }}
      aria-hidden="true"
    />
  )
}
