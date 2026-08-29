import { Router } from 'express';
import { capturePreview, getPreview, getLivePreview } from '../controllers/preview.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/:id/capture', capturePreview);
router.get('/:id', getPreview);
router.get('/:id/live', getLivePreview);

export default router;
