import { Router } from 'express';
import {
  createNode,
  getNodes,
  getNode,
  updateNode,
  deleteNode,
  getNodeStatus,
  startMonitoring,
  stopMonitoring
} from '../controllers/nodes.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createNode);
router.get('/', getNodes);
router.get('/:id', getNode);
router.put('/:id', updateNode);
router.delete('/:id', deleteNode);
router.get('/:id/status', getNodeStatus);
router.post('/:id/monitor/start', startMonitoring);
router.post('/:id/monitor/stop', stopMonitoring);

export default router;
