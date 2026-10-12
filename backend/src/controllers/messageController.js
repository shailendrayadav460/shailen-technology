import mongoose from 'mongoose';
import { z } from 'zod';
import Message from '../models/Message.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clean } from '../utils/text.js';

export const contactSchema = z.object({
  name: z.string().min(2, 'Enter your name').max(80).transform(clean),
  email: z.string().email('Enter a valid email').max(120),
  subject: z.string().max(120).optional().default('').transform(clean),
  message: z.string().min(10, 'Message needs at least 10 characters').max(3000).transform(clean),
  website: z.string().optional().default(''), // honeypot: real people leave this empty
});

export const submit = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body;
  if (!website) await Message.create(data); // bots get a fake success and nothing is stored
  res.status(201).json({ message: 'Thanks, your message has been sent.' });
});

export const listAdmin = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json({ messages });
});

export const markRead = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const m = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!m) return res.status(404).json({ message: 'Message not found' });
  res.json({ message: m });
});

export const remove = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const m = await Message.findByIdAndDelete(req.params.id);
  if (!m) return res.status(404).json({ message: 'Message not found' });
  res.json({ message: 'Message deleted' });
});
