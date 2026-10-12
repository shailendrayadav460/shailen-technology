export const site = {
  name: 'Shailendra Technology',
  tagline: 'Websites and web apps, built end to end.',
  email: 'shailendrayadaw2004@gmail.com',
  phone: '+91 9305815719',
  location: 'Noida, Uttar Pradesh, India',
  github: 'https://github.com/shailendrayadav460',
  linkedin: 'https://www.linkedin.com/in/shailendra-yadavvv',
};

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

// Add a new service by adding one object here. status: 'live' | 'soon'
export const services = [
  {
    id: 'web',
    title: 'Web development',
    status: 'live',
    text: 'React and Next.js websites that load fast, work on phones, and are set up to be found on Google.',
  },
  {
    id: 'backend',
    title: 'Backend and APIs',
    status: 'live',
    text: 'Secure Node.js and Express APIs with logins, roles, payments through Razorpay, and WhatsApp messages through Twilio.',
  },
  {
    id: 'ai',
    title: 'AI and automation',
    status: 'live',
    text: 'ChatGPT and Claude features inside your product, plus n8n workflows that connect the tools your team already uses.',
  },
  {
    id: 'hosting',
    title: 'Hosting and care',
    status: 'soon',
    text: 'We deploy your site, keep it updated, and manage its content for you. Opening soon.',
  },
];

export const projects = [
  { name: 'Xpecto AI', stack: 'Next.js, Express, MySQL', text: 'Marketing site with a blog CMS, image uploads, and a contact form that routes leads by email.', url: 'https://xpectoai.com' },
  { name: 'BugTracker', stack: 'React, Express, MongoDB', text: 'Bug and project management with roles, scheduled email reports, and CSV import and export.', url: 'https://webapp.work4code.com/' },
  { name: 'AI-SaaS', stack: 'React, PostgreSQL, Prisma', text: 'AI assistant that books calendar events and sends emails, with Razorpay plans and WhatsApp for paid users.', url: 'https://ai-saas-three-eosin.vercel.app/' },
];
