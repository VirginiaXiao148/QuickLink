const express = require('express');
const urlRouter = require('./src/routes/url');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/urls', urlRouter);
app.use('/', urlRouter);

module.exports = app;
