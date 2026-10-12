import { useState } from 'react';

const blankItem = { title: '', text: '', icon: '', order: 0 };

export default function WhatWeDoManager({ items, onSave, onDelete }) {
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(blankItem);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const startNew = () => {
    setForm(blankItem);
    setEditing('new');
    setErr('');
  };

  const startEdit = (item) => {
    setForm({
      title: item.title || '',
      text: item.text || '',
      icon: item.icon || '',
      order: item.order ?? 0,
    });
    setEditing(item);
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
        <h3 style={{ margin: 0 }}>"What We Do" Management</h3>
        {!editing && (
          <button type="button" className="btn" onClick={startNew}>
            + Add New Item
          </button>
        )}
      </div>

      {editing && (
        <form className="form panel" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <h4>{editing === 'new' ? 'New "What We Do" Item' : `Edit "${editing.title}"`}</h4>

          <label>
            Title
            <input value={form.title} onChange={setField('title')} required maxLength={100} placeholder="e.g. Design & Architecture" />
          </label>

          <label>
            Description / Text
            <textarea
              rows={3}
              value={form.text}
              onChange={setField('text')}
              required
              maxLength={500}
              placeholder="What we do in this domain..."
            />
          </label>

          <div className="form-row-2">
            <label>
              Icon / Badge (optional)
              <input value={form.icon} onChange={setField('icon')} placeholder="e.g. 🛠️" />
            </label>

            <label>
              Display Order
              <input type="number" value={form.order} onChange={setField('order')} placeholder="1, 2, 3..." />
            </label>
          </div>

          {err && <p className="err" role="alert">{err}</p>}

          <div className="row" style={{ marginTop: '0.5rem' }}>
            <button className="btn" disabled={saving}>
              {saving ? 'Saving…' : editing === 'new' ? 'Create Item' : 'Update Item'}
            </button>
            <button type="button" className="btn ghost" onClick={cancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="muted">No items found in database.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Title</th>
                <th>Description</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.order}</td>
                  <td><strong>{item.title}</strong></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{item.text}</td>
                  <td className="actions">
                    <button type="button" className="link" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className="link danger" onClick={() => onDelete(item)}>
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
