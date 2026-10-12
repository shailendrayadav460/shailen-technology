// Strip any HTML tags from user text. The frontend also renders everything
// as plain text (never innerHTML), so this is a second layer of defence.
export const clean = (value = '') => String(value).replace(/<\/?[a-zA-Z!][^>]*>/g, '').trim();

export function slugify(text) {
  return clean(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
