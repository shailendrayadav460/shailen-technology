import { useState } from 'react';

const blank = { title: '', excerpt: '', content: '', cover: '', tags: '', published: true };

export default function PostForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? {
          ...initial,
          cover: initial.cover || '',
          tags: (initial.tags || []).join(', '),
          published: initial.published ?? true,
        }
      : blank
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({
        cover: form.cover.trim(),
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 6),
        published: form.published,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="form panel" onSubmit={submit}>
      <h3>{initial ? 'Edit post' : 'New post'}</h3>

      {/* 1. Image first (Cover image) */}
      <label>
        Cover image URL
        <input
          value={form.cover}
          onChange={set('cover')}
          placeholder="https://images.unsplash.com/... or image link"
        />
      </label>
      {form.cover && (
        <div style={{ margin: '0.2rem 0 0.8rem' }}>
          <img
            src={form.cover}
            alt="Preview"
            style={{ maxHeight: '160px', width: '100%', objectFit: 'cover', border: '1px solid var(--line)' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* 2. Title */}
      <label>
        Title
        <input value={form.title} onChange={set('title')} required maxLength={150} placeholder="Post title" />
      </label>

      {/* 3. Summary */}
      <label>
        Summary
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={set('excerpt')}
          required
          maxLength={300}
          placeholder="Brief summary of the post"
        />
      </label>

      {/* 4. Content */}
      <label>
        Content (paragraphs separated by blank lines)
        <textarea
          rows={10}
          value={form.content}
          onChange={set('content')}
          required
          placeholder="Write complete article content here..."
        />
      </label>

      {/* 5. Tags */}
      <label>
        Tags (comma separated)
        <input value={form.tags} onChange={set('tags')} placeholder="e.g. tech, react, design" />
      </label>

      {/* 6. Published status */}
      <label className="check">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
        />
        Published (visible to visitors)
      </label>

      {error && <p className="err" role="alert">{error}</p>}

      <div className="row">
        <button className="btn" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Publish post'}
        </button>
        <button type="button" className="btn ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
