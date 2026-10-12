import crypto from 'crypto';
import mongoose from 'mongoose';
import { z } from 'zod';
import Post from '../models/Post.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clean, slugify } from '../utils/text.js';

export const postSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters').max(150).transform(clean),
  excerpt: z.string().min(10, 'Summary needs at least 10 characters').max(300).transform(clean),
  content: z.string().min(20, 'Content needs at least 20 characters').max(20000).transform(clean),
  cover: z.union([z.literal(''), z.string().url().regex(/^https?:\/\//, 'Cover must be an http(s) link')]).default(''),
  tags: z.array(z.string().max(30).transform(clean)).max(6).transform((a) => a.filter(Boolean)).default([]),
  published: z.boolean().default(true),
});

const publicFields = 'title slug excerpt content cover tags createdAt updatedAt';

// ---------- Public (read only) ----------
export const listPublic = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 9));
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Post.find({ published: true }).select(publicFields).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments({ published: true }),
  ]);
  res.json({ posts, total, page, limit, totalPages: Math.ceil(total / limit) });
});

export const getPublic = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: String(req.params.slug), published: true }).select(publicFields).lean();
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ post });
});

// ---------- Admin ----------
export const listAdmin = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  res.json({ posts });
});

export const create = asyncHandler(async (req, res) => {
  let slug = slugify(req.body.title) || 'post';
  if (await Post.exists({ slug })) slug += `-${crypto.randomBytes(2).toString('hex')}`;
  const post = await Post.create({ ...req.body, slug });
  res.status(201).json({ post });
});

export const update = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ post });
});

export const remove = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ message: 'Post deleted' });
});
