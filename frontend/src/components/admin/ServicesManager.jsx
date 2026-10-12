import { useState } from 'react';

const blankService = { title: '', text: '', status: 'live', icon: '', order: 0 };

export default function ServicesManager({ services, onSave, onDelete }) {
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(blankService);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const startNew = () => {
    setForm(blankService);
    setEditing('new');
    setErr('');
  };

  const startEdit = (s) => {
    setForm({
      title: s.title || '',
      text: s.text || '',
      status: s.status || 'live',
      icon: s.icon || '',
      order: s.order ?? 0,
    });
    setEditing(s);
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
        <h3 style={{ margin: 0 }}>Services Management</h3>
        {!editing && (
          <button type="button" className="btn" onClick={startNew}>
            + Add New Service
          </button>
        )}
      </div>

      {editing && (
        <form className="form panel" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h4>{editing === 'new' ? 'New Service' : `Edit "${editing.title}"`}</h4>

          <label>
            Service Title
            <input value={form.title} onChange={setField('title')} required maxLength={100} placeholder="e.g. Web Development" />
          </label>

          <label>
            Description / Text
            <textarea
              rows={3}
              value={form.text}
              onChange={setField('text')}
              required
              maxLength={500}
              placeholder="What this service provides..."
            />
          </label>

          <div className="form-row-3">
            <label>
              Status
              <select value={form.status} onChange={setField('status')} style={{ padding: '0.7rem 0.8rem', border: '1px solid var(--line)', background: '#fffdf8' }}>
                <option value="live">Live (Active)</option>
                <option value="soon">Coming Soon</option>
              </select>
            </label>

            <label>
              Icon / Symbol (optional)
              <input value={form.icon} onChange={setField('icon')} placeholder="e.g. ⚡ or code" />
            </label>

            <label>
              Display Order
              <input type="number" value={form.order} onChange={setField('order')} placeholder="1, 2, 3..." />
            </label>
          </div>

          {err && <p className="err" role="alert">{err}</p>}

          <div className="row" style={{ marginTop: '0.5rem' }}>
            <button className="btn" disabled={saving}>
              {saving ? 'Saving…' : editing === 'new' ? 'Create Service' : 'Update Service'}
            </button>
            <button type="button" className="btn ghost" onClick={cancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <p className="muted">No services found in database.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Title</th>
                <th>Description</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id}>
                  <td>{s.order}</td>
                  <td><strong>{s.title}</strong></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{s.text}</td>
                  <td>
                    <span className={s.status === 'live' ? 'ok' : 'tag'}>
                      {s.status === 'live' ? 'Live' : 'Soon'}
                    </span>
                  </td>
                  <td className="actions">
                    <button type="button" className="link" onClick={() => startEdit(s)}>
                      Edit
                    </button>
                    <button type="button" className="link danger" onClick={() => onDelete(s)}>
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
