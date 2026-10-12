import { useState } from 'react';

const blankProject = { name: '', stack: '', text: '', url: '', image: '', order: 0 };

export default function ProjectsManager({ projects, onSave, onDelete }) {
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(blankProject);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const startNew = () => {
    setForm(blankProject);
    setEditing('new');
    setErr('');
  };

  const startEdit = (p) => {
    setForm({
      name: p.name || '',
      stack: p.stack || '',
      text: p.text || '',
      url: p.url || '',
      image: p.image || '',
      order: p.order ?? 0,
    });
    setEditing(p);
    setErr('');
  };

  const cancel = () => {
    setEditing(null);
    setErr('');
  };

  const setField = (k) => (e) => {
    const val = k === 'order' ? parseInt(e.target.value) || 0 : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      await onSave(editing === 'new' ? null : editing._id, form);
      setEditing(null);
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <h3 style={{ margin: 0 }}>Selected Work (Projects) Management</h3>
        {!editing && (
          <button type="button" className="btn" onClick={startNew}>
            + Add New Project
          </button>
        )}
      </div>

      {editing && (
        <form className="form panel" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h4>{editing === 'new' ? 'New Project' : `Edit "${editing.name}"`}</h4>

          <label>
            Project Name
            <input value={form.name} onChange={setField('name')} required maxLength={100} placeholder="e.g. Modern E-Commerce Platform" />
          </label>

          <label>
            Tech Stack
            <input value={form.stack} onChange={setField('stack')} required maxLength={200} placeholder="e.g. Next.js, Node.js, Stripe, Tailwind" />
          </label>

          <label>
            Description / Overview
            <textarea
              rows={3}
              value={form.text}
              onChange={setField('text')}
              required
              maxLength={500}
              placeholder="What this project achieved..."
            />
          </label>

          <div className="form-row-2">
            <label>
              Project Website URL (optional)
              <input value={form.url} onChange={setField('url')} placeholder="https://example.com" />
            </label>

            <label>
              Preview Image URL (optional)
              <input value={form.image} onChange={setField('image')} placeholder="https://.../preview.jpg" />
            </label>
          </div>

          <label style={{ width: '150px' }}>
            Display Order
            <input type="number" value={form.order} onChange={setField('order')} placeholder="1, 2, 3..." />
          </label>

          {err && <p className="err" role="alert">{err}</p>}

          <div className="row" style={{ marginTop: '0.5rem' }}>
            <button className="btn" disabled={saving}>
              {saving ? 'Saving…' : editing === 'new' ? 'Create Project' : 'Update Project'}
            </button>
            <button type="button" className="btn ghost" onClick={cancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <p className="muted">No projects found in database.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Name</th>
                <th>Tech Stack</th>
                <th>Description</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.order}</td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.url && (
                      <div>
                        <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem' }}>
                          View link ↗
                        </a>
                      </div>
                    )}
                  </td>
                  <td><span className="tag" style={{ margin: 0 }}>{p.stack}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{p.text}</td>
                  <td className="actions">
                    <button type="button" className="link" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button type="button" className="link danger" onClick={() => onDelete(p)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
