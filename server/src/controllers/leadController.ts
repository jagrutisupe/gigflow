import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/authMiddleware';
import { Parser } from 'json2csv';

// Shared query builder for filters
const buildQuery = (queryParams: Record<string, string>) => {
  const { status, source, search, sort } = queryParams;
  const filter: Record<string, any> = {};

  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  return { filter, sortOption };
};

// GET /api/leads
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const { filter, sortOption } = buildQuery(req.query as Record<string, string>);

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort(sortOption as any).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: leads,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

// GET /api/leads/:id
export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, data: lead });
};

// POST /api/leads
export const createLead = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('source').isIn(['Website', 'Instagram', 'Referral']),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),

  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const lead = await Lead.create({ ...req.body, createdBy: req.user!._id });
    res.status(201).json({ success: true, data: lead });
  },
];

// PUT /api/leads/:id
export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, data: lead });
};

// DELETE /api/leads/:id  (admin only — enforced in route)
export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, message: 'Lead deleted' });
};

// GET /api/leads/export (CSV)
export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const { filter } = buildQuery(req.query as Record<string, string>);

  const leads = await Lead.find(filter).lean();
  const fields = ['name', 'email', 'status', 'source', 'createdAt'];
  const parser = new Parser({ fields });
  const csv = parser.parse(leads);

  res.header('Content-Type', 'text/csv');
  res.attachment('leads.csv');
  res.send(csv);
};