import { useState } from 'react';
import { contactService } from '../../services/blogService.js';
import { site } from '../../config/site.js';

const empty = { name: '', email: '', subject: '', message: '', website: '' };

export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [state, setState] = useState({ status: 'idle', message: '' }); // idle | sending | sent | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setState({ status: 'sending', message: '' });
    try {
      const res = await contactService.send(form);
      setForm(empty);
      setState({ status: 'sent', message: res.message });
    } catch (err) {
      setState({
        status: 'error',
        message: err.isNetwork
          ? 'We could not reach the server, so your message was not sent. Please email us directly.'
          : err.message,
      });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label>Your name<input value={form.name} onChange={set('name')} required maxLength={80} autoComplete="name" /></label>
      <label>Email<input type="email" value={form.email} onChange={set('email')} required maxLength={120} autoComplete="email" /></label>
      <label>Subject (optional)<input value={form.subject} onChange={set('subject')} maxLength={120} /></label>
      <label>Message<textarea rows={6} value={form.message} onChange={set('message')} required maxLength={3000} /></label>
      {/* Honeypot: hidden from people, bots fill it in */}
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} />
      <button className="btn" disabled={state.status === 'sending'}>
        {state.status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {state.status === 'sent' && <p className="ok" role="status">{state.message}</p>}
      {state.status === 'error' && (
        <p className="err" role="alert">
          {state.message} <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      )}
    </form>
  );
}
