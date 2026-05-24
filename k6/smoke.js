import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
}

export default function () {
  const pages = ['/', '/api/health']

  for (const path of pages) {
    const res = http.get(`${BASE_URL}${path}`)

    check(res, {
      [`${path} status 200`]: (r) => r.status === 200,
      [`${path} response time < 2s`]: (r) => r.timings.duration < 2000,
    })
  }

  // POST /api/contact — 429 is expected under rate-limiting; mark it as non-failure
  const contactRes = http.post(
    `${BASE_URL}/api/contact`,
    JSON.stringify({ name: 'k6', email: 'k6@test.com', message: 'Load test message for smoke run.' }),
    {
      headers: { 'Content-Type': 'application/json' },
      responseCallback: http.expectedStatuses(200, 429),
    }
  )
  check(contactRes, {
    'POST /api/contact 200 or 429': (r) => r.status === 200 || r.status === 429,
  })

  // GET /api/projects
  const projRes = http.get(`${BASE_URL}/api/projects`)
  check(projRes, {
    'GET /api/projects 200': (r) => r.status === 200,
  })

  sleep(1)
}
