export interface Project {
  name: string
  category: string
  url: string
  displayUrl: string
  description: string
  tags: string[]
  accent: string
  countries: string[]
  /**
   * Globe camera target used when the project is hovered. `center` is
   * [lng, lat]; `zoom` frames the country without losing the globe curvature.
   * Hand-tuned per country rather than derived from GeoJSON centroids, which
   * misbehave for large countries that cross the antimeridian (e.g. USA/Alaska).
   */
  focus?: {
    center: [number, number]
    zoom: number
  }
}

export const PROJECTS: Project[] = [
  {
    name: 'Sphere · BEAM',
    category: 'Web3 · NFT Marketplace',
    url: 'https://sphere.market/beam',
    displayUrl: 'sphere.market/beam',
    description:
      'NFT marketplace on the BEAM blockchain. Assisted QA across trading flows, wallet connections, smart contract interactions, and high-concurrency auction mechanics.',
    tags: ['Web3', 'Playwright', 'Cypress'],
    accent: '#818cf8',
    countries: ['USA'],
    focus: { center: [-98, 39.5], zoom: 3.2 },
  },
  {
    name: 'Eigen Huis',
    category: 'Dutch Housing Service',
    url: 'https://www.eigenhuis.nl/',
    displayUrl: 'eigenhuis.nl',
    description:
      "The Netherlands' leading home ownership advisory platform. End-to-end testing of mortgage calculators, property search, multi-step advice flows, and accessibility compliance.",
    tags: ['E2E', 'Accessibility', 'Playwright'],
    accent: '#fb923c',
    countries: ['NLD'],
    focus: { center: [5.3, 52.2], zoom: 4.6 },
  },
  {
    name: 'Ramboll',
    category: 'Engineering & Consulting',
    url: 'https://www.ramboll.com/',
    displayUrl: 'ramboll.com',
    description:
      'Global engineering and sustainability consultancy. QA across CMS-driven content, multi-region deployments, complex form workflows, and performance regression testing.',
    tags: ['CMS', 'Performance', 'Multi-region'],
    accent: '#34d399',
    countries: ['DNK'],
    focus: { center: [10.4, 56.0], zoom: 4.6 },
  },
]
