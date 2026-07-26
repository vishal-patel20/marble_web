import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import inquiryRoutes from './inquiry.routes.js';
import miscRoutes from './misc.routes.js';

const router = Router();

// Mounting namespaces
router.use('/auth', authRoutes);
router.use('/inventory', productRoutes);
router.use('/leads', inquiryRoutes);
router.use('/misc', miscRoutes);

export default router;
export { router };
