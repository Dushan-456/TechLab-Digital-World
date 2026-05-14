import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from './models/User.mjs';
import Invitation from './models/Invitation.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// Routes

// 1. Auth: Login
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Invitations: Create (Protected)
app.post('/api/invitations', authenticateToken, [
  body('cardId').notEmpty().withMessage('Card ID is required').isSlug().withMessage('Card ID must be a valid slug'),
  body('templateId').isIn(['ethereal', 'lumina', 'kinetic']).withMessage('Invalid template'),
  body('couple.bride').notEmpty().withMessage('Bride name is required'),
  body('couple.groom').notEmpty().withMessage('Groom name is required'),
  body('event.date').isISO8601().withMessage('Valid date is required'),
  body('event.location').notEmpty().withMessage('Location is required'),
  body('content.welcomeText').notEmpty().withMessage('Welcome text is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingCard = await Invitation.findOne({ cardId: req.body.cardId });
    if (existingCard) return res.status(400).json({ message: 'Card ID already exists' });

    const newInvitation = new Invitation(req.body);
    await newInvitation.save();
    res.status(201).json(newInvitation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Invitations: Fetch (Public)
app.get('/api/invitations/:cardId', async (req, res) => {
  try {
    const invitation = await Invitation.findOne({ cardId: req.params.cardId });
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
    res.json(invitation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
