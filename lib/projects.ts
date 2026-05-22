export interface Project {
  name: string
  category: string
  url: string
  displayUrl: string
  description: string
  tags: string[]
  accent: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Sphere · BEAM',
    category: 'Web3 · NFT Marketplace',
    url: 'https://sphere.market/beam',
    displayUrl: 'sphere.market/beam',
    description:
      'NFT marketplace on the BEAM blockchain. Assisted QA across trading flows, wallet connections, smart contract interactions, and high-concurrency auction mechanics.',
    tags: ['Web3', 'Playwright', 'API testing'],
    accent: '#818cf8',
  },
  {
    name: 'Eigen Huis',
    category: 'Dutch Housing Service',
    url: 'https://www.eigenhuis.nl/',
    displayUrl: 'eigenhuis.nl',
    description:
      "The Netherlands' leading home ownership advisory platform. End-to-end testing of mortgage calculators, property search, multi-step advice flows, and accessibility compliance.",
    tags: ['E2E', 'Accessibility', 'Multi-locale'],
    accent: '#fb923c',
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
  },
]
