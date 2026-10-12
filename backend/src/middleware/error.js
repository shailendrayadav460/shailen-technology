import { env } from '../config/env.js';

export const notFound = (req, res) => res.status(404).json({ message: 'Not found' });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.code === 11000) return res.status(409).json({ message: 'Already exists' });
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ message: 'Origin not allowed' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON in request' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Payload too large' });
  if (!env.isProd) console.error(err);
  else console.error(err.message);
  res.status(500).json({ message: 'Something went wrong on the server' });
}
