import http from 'k6/http'
import { check, sleep } from 'k6'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.005'],
  },
}

export function handleSummary(data) {
  return {
    'k6-report.html': htmlReport(data),
    stdout: JSON.stringify(data, null, 2),
  }
}

export default function () {
  const res = http.get(BASE_URL)

  check(res, {
    'homepage status 200': (r) => r.status === 200,
    'homepage p95 < 1s': (r) => r.timings.duration < 1000,
  })

  sleep(Math.random() * 2 + 1)
}
