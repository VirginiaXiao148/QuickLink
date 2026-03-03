jest.mock('../src/models/Url');

const request = require('supertest');
const app = require('../app');
const Url = require('../src/models/Url');

// Shared mock URL document factory
const makeMockUrl = (overrides = {}) => {
  const doc = {
    originalUrl: 'https://example.com',
    shortCode: 'abc1234',
    clicks: 0,
    createdAt: new Date('2024-01-01'),
    expiresAt: null,
    save: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
  return doc;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/urls', () => {
  it('creates a short URL and returns 201', async () => {
    const mockDoc = makeMockUrl();
    Url.exists.mockResolvedValue(false);
    Url.create.mockResolvedValue(mockDoc);

    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'https://example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('shortCode', 'abc1234');
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body.originalUrl).toBe('https://example.com');
    expect(res.body.clicks).toBe(0);
  });

  it('returns 400 when originalUrl is missing', async () => {
    const res = await request(app).post('/api/urls').send({});
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for an invalid URL', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'not-a-url' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for a non-http/https URL', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'ftp://example.com' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 500 on a database error', async () => {
    Url.exists.mockResolvedValue(false);
    Url.create.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/urls')
      .send({ originalUrl: 'https://example.com' });

    expect(res.statusCode).toBe(500);
  });
});

describe('GET /:shortCode', () => {
  it('redirects to the original URL and increments clicks', async () => {
    const mockDoc = makeMockUrl();
    Url.findOne.mockResolvedValue(mockDoc);

    const res = await request(app).get('/abc1234');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://example.com');
    expect(mockDoc.save).toHaveBeenCalled();
    expect(mockDoc.clicks).toBe(1);
  });

  it('returns 404 for an unknown short code', async () => {
    Url.findOne.mockResolvedValue(null);

    const res = await request(app).get('/unknownxyz');
    expect(res.statusCode).toBe(404);
  });

  it('returns 410 for an expired short URL', async () => {
    const mockDoc = makeMockUrl({ expiresAt: new Date('2000-01-01') });
    Url.findOne.mockResolvedValue(mockDoc);

    const res = await request(app).get('/abc1234');
    expect(res.statusCode).toBe(410);
  });
});

describe('GET /api/urls/:shortCode/stats', () => {
  it('returns stats for a short URL', async () => {
    const mockDoc = makeMockUrl({ clicks: 5 });
    Url.findOne.mockResolvedValue(mockDoc);

    const res = await request(app).get('/api/urls/abc1234/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.clicks).toBe(5);
    expect(res.body.originalUrl).toBe('https://example.com');
  });

  it('returns 404 for an unknown short code', async () => {
    Url.findOne.mockResolvedValue(null);

    const res = await request(app).get('/api/urls/doesnotexist/stats');
    expect(res.statusCode).toBe(404);
  });
});
