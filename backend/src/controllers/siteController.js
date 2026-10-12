import { z } from 'zod';
import mongoose from 'mongoose';
import Service from '../models/Service.js';
import WhatWeDo from '../models/WhatWeDo.js';
import Project from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { clean } from '../utils/text.js';

// ───── Schemas ─────
export const serviceSchema = z.object({
  title: z.string().min(2).max(100).transform(clean),
  text: z.string().min(5).max(500).transform(clean),
  status: z.enum(['live', 'soon']).default('live'),
  icon: z.string().max(50).default('').transform(clean),
  order: z.number().int().default(0),
});

export const whatWeDoSchema = z.object({
  title: z.string().min(2).max(100).transform(clean),
  text: z.string().min(5).max(500).transform(clean),
  icon: z.string().max(50).default('').transform(clean),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  name: z.string().min(2).max(100).transform(clean),
  stack: z.string().min(2).max(200).transform(clean),
  text: z.string().min(5).max(500).transform(clean),
  url: z.union([z.literal(''), z.string().url()]).default(''),
  image: z.union([z.literal(''), z.string().url()]).default(''),
  order: z.number().int().default(0),
});

// ───── Services CRUD ─────
export const listServices = asyncHandler(async (req, res) => {
  const items = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json({ services: items });
});

export const createService = asyncHandler(async (req, res) => {
  const item = await Service.create(req.body);
  res.status(201).json({ service: item });
});

export const updateService = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ service: item });
});

export const removeService = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const item = await Service.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

// ───── WhatWeDo CRUD ─────
export const listWhatWeDo = asyncHandler(async (req, res) => {
  const items = await WhatWeDo.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json({ items });
});

export const createWhatWeDo = asyncHandler(async (req, res) => {
  const item = await WhatWeDo.create(req.body);
  res.status(201).json({ item });
});

export const updateWhatWeDo = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const item = await WhatWeDo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ item });
});

export const removeWhatWeDo = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const item = await WhatWeDo.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

// ───── Projects CRUD ─────
export const listProjects = asyncHandler(async (req, res) => {
  const items = await Project.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json({ projects: items });
});

export const createProject = asyncHandler(async (req, res) => {
  const item = await Project.create(req.body);
  res.status(201).json({ project: item });
});

export const updateProject = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const item = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ project: item });
});

export const removeProject = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});
