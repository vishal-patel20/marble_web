import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import validate from '../validators/validate.js';

const router = Router();

// Public routes
router.post('/register', registerValidator, validate, AuthController.register);
router.post('/login', loginValidator, validate, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', protect, AuthController.getMe);

export default router;
