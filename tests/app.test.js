const request = require('supertest');
const app = require('../src/app');

describe('Suite de tests WebApp CI/CD', () => {
  it('GET / doit répondre avec le statut 200 et du HTML valide', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Version 1.0');
    expect(res.text).toContain('Application Déployée');
  });

  it('GET /api/status doit retourner le statut de l\'application et la version 1.0', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('version', '1.0');
    expect(res.body).toHaveProperty('timestamp');
  });
});
