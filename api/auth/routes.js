import express from 'express';
import handler from './index.js';

const router = express.Router();

router.post('/signup', (req, res) => handler(req, { ...res, query: { path: 'signup' } }));
router.post('/login', (req, res) => handler(req, { ...res, query: { path: 'login' } }));
router.post('/reset-password', (req, res) => handler(req, { ...res, query: { path: 'reset-password' } }));

export default router; 