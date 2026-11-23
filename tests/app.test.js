const request = require('supertest');
const app = require('../src/app');

describe('Suite de tests WebApp CI/CD & Observabilité', () => {
  it('GET / doit répondre avec le statut 200 et du HTML valide', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toMatch(/Version \d+\.\d+/);
    expect(res.text).toContain('Application Déployée');
  });

  it('GET /api/status doit retourner le statut de l\'application', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /metrics doit exposer les métriques Prometheus', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('process_cpu_user_seconds_total');
    expect(res.text).toContain('http_requests_total');
  });
});
