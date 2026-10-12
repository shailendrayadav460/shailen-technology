// Shown when the backend cannot be reached, so the blog is never empty.
export const fallbackPosts = [
  {
    _id: 'fallback-1',
    slug: 'welcome-to-shailendra-technology',
    title: 'Welcome to Shailendra Technology',
    excerpt: 'What we build, how we work, and what is coming next on this site.',
    content:
      'Shailendra Technology builds websites and web apps from the database to the browser.\n\nThis blog is where we share what we learn while shipping React, Node, and automation projects.',
    tags: ['company'],
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    _id: 'fallback-2',
    slug: 'why-every-site-needs-a-fallback',
    title: 'Why every site needs a fallback',
    excerpt: 'A short note on keeping a frontend useful when the API is down.',
    content:
      'Servers restart, databases hiccup, and free hosting tiers sleep.\n\nA good frontend keeps showing what it can, tells the visitor what is unavailable, and recovers on its own when the API returns.',
    tags: ['engineering'],
    createdAt: '2026-10-02T00:00:00.000Z',
  },
];
