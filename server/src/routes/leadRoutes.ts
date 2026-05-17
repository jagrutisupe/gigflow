import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';
import {
  getLeads, getLead, createLead,
  updateLead, deleteLead, exportLeads
} from '../controllers/leadController';

const router = Router();
router.use(protect); // All lead routes are protected

router.get('/export', exportLeads);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', adminOnly, deleteLead); // Only admin can delete
export default router;