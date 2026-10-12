import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import './config/env.js';
import { connectDB } from './config/db.js';
import Admin from './models/Admin.js';
import Post from './models/Post.js';
import Service from './models/Service.js';
import WhatWeDo from './models/WhatWeDo.js';
import Project from './models/Project.js';

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
  console.error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in .env');
  process.exit(1);
}

await connectDB();

// ── Admin ──────────────────────────────────────────────
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await Admin.findOneAndUpdate(
  { email: ADMIN_EMAIL.toLowerCase() },
  { email: ADMIN_EMAIL.toLowerCase(), passwordHash },
  { upsert: true }
);
console.log(`✅ Admin ready: ${ADMIN_EMAIL}`);

// ── Blog Posts ─────────────────────────────────────────
if ((await Post.countDocuments()) === 0) {
  await Post.create([
    {
      title: 'Welcome to Shailendra Technology',
      slug: 'welcome-to-shailendra-technology',
      excerpt: 'What we build, how we work, and what is coming next on this site.',
      content:
        'Shailendra Technology builds websites and web apps from the database to the browser.\n\nThis blog is where we share what we learn while shipping React, Node, and automation projects.',
      tags: ['company'],
      cover: '',
    },
    {
      title: 'Why every site needs a fallback',
      slug: 'why-every-site-needs-a-fallback',
      excerpt: 'A short note on keeping a frontend useful when the API is down.',
      content:
        'Servers restart, databases hiccup, and free hosting tiers sleep.\n\nA good frontend keeps showing what it can, tells the visitor what is unavailable, and recovers on its own when the API returns.',
      tags: ['engineering'],
      cover: '',
    },
  ]);
  console.log('✅ Sample posts created');
}

// ── Services ───────────────────────────────────────────
if ((await Service.countDocuments()) === 0) {
  await Service.create([
    { title: 'Web development', status: 'live', order: 1, text: 'React and Next.js websites that load fast, work on phones, and are set up to be found on Google.', icon: '🌐' },
    { title: 'Backend and APIs', status: 'live', order: 2, text: 'Secure Node.js and Express APIs with logins, roles, payments through Razorpay, and WhatsApp messages through Twilio.', icon: '⚙️' },
    { title: 'AI and automation', status: 'live', order: 3, text: 'ChatGPT and Claude features inside your product, plus n8n workflows that connect the tools your team already uses.', icon: '🤖' },
    { title: 'Hosting and care', status: 'soon', order: 4, text: 'We deploy your site, keep it updated, and manage its content for you. Opening soon.', icon: '🚀' },
  ]);
  console.log('✅ Services seeded');
}

// ── What We Do ─────────────────────────────────────────
if ((await WhatWeDo.countDocuments()) === 0) {
  await WhatWeDo.create([
    { title: 'Web development', order: 1, text: 'React and Next.js websites that load fast, work on phones, and are set up to be found on Google.', icon: '🌐' },
    { title: 'Backend and APIs', order: 2, text: 'Secure Node.js and Express APIs with logins, roles, payments, and WhatsApp automation.', icon: '⚙️' },
    { title: 'AI and automation', order: 3, text: 'ChatGPT and Claude features inside your product, plus n8n workflows for your team.', icon: '🤖' },
    { title: 'Hosting and care', order: 4, text: 'We deploy your site, keep it updated, and manage its content for you.', icon: '🚀' },
  ]);
  console.log('✅ What We Do seeded');
}

// ── Projects ───────────────────────────────────────────
if ((await Project.countDocuments()) === 0) {
  await Project.create([
    { name: 'Xpecto AI', stack: 'Next.js, Express, MySQL', order: 1, text: 'Marketing site with a blog CMS, image uploads, and a contact form that routes leads by email.', url: 'https://xpectoai.com', image: '' },
    { name: 'BugTracker', stack: 'React, Express, MongoDB', order: 2, text: 'Bug and project management with roles, scheduled email reports, and CSV import and export.', url: 'https://webapp.work4code.com/', image: '' },
    { name: 'AI-SaaS', stack: 'React, PostgreSQL, Prisma', order: 3, text: 'AI assistant that books calendar events and sends emails, with Razorpay plans and WhatsApp for paid users.', url: 'https://ai-saas-three-eosin.vercel.app/', image: '' },
  ]);
  console.log('✅ Projects seeded');
}

await mongoose.disconnect();
console.log('🎉 Seed complete!');
