# QuickLink

A URL shortener built with **Node.js**, **Express**, and **MongoDB**.

## Project Structure

```
QuickLink/
├── src/
│   ├── config/
│   │   └── database.js        # MongoDB connection setup
│   ├── controllers/
│   │   └── urlController.js   # Business logic (create, redirect, stats)
│   ├── middleware/
│   │   └── validateUrl.js     # URL validation middleware
│   ├── models/
│   │   └── Url.js             # Mongoose data model
│   ├── routes/
│   │   └── url.js             # Express route definitions
│   └── utils/
│       └── generateShortCode.js  # Short code generator (nanoid)
├── tests/
│   └── url.test.js            # Jest tests (mocked DB)
├── app.js                     # Express application setup
├── server.js                  # Entry point (connects DB, starts server)
├── .env.example               # Environment variable template
└── package.json
```

## Data Model

The `Url` collection stores the following fields:

| Field         | Type   | Required | Default | Description                          |
|---------------|--------|----------|---------|--------------------------------------|
| `originalUrl` | String | ✅       | —       | The full URL to redirect to          |
| `shortCode`   | String | ✅       | —       | Unique short identifier (7 chars)    |
| `clicks`      | Number | —        | `0`     | How many times the link was accessed |
| `expiresAt`   | Date   | —        | `null`  | Optional expiry date                 |
| `createdAt`   | Date   | —        | auto    | Timestamp (via Mongoose timestamps)  |
| `updatedAt`   | Date   | —        | auto    | Timestamp (via Mongoose timestamps)  |

## API Endpoints

| Method | Path                         | Description                    |
|--------|------------------------------|--------------------------------|
| POST   | `/api/urls`                  | Create a short URL             |
| GET    | `/:shortCode`                | Redirect to the original URL   |
| GET    | `/api/urls/:shortCode/stats` | Get click statistics for a URL |
| GET    | `/health`                    | Health check                   |

### POST `/api/urls`

**Request body:**
```json
{
  "originalUrl": "https://example.com",
  "expiresAt": "2025-12-31T00:00:00.000Z"
}
```

**Response (201):**
```json
{
  "shortUrl": "http://localhost:3000/abc1234",
  "shortCode": "abc1234",
  "originalUrl": "https://example.com",
  "clicks": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": null
}
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or a MongoDB Atlas connection string)

### Setup

```bash
# Install dependencies
npm install

# Copy the environment template and fill in your values
cp .env.example .env

# Start the server
npm start

# Development mode (with auto-reload)
npm run dev
```

### Running Tests

```bash
npm test
```
