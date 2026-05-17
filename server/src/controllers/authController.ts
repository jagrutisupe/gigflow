import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const signToken = (id: string): string => {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

export const register = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),

  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already in use' });
      return;
    }

    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  },
];

export const login = [
  body('email').isEmail(),
  body('password').notEmpty(),

  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = signToken(user._id.toString());
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  },
];