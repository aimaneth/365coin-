import express from 'express';
import { signup } from './signup.js';
import { login } from './login.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-token', verifyToken);

export default router; 