import { useEffect, useState } from 'react';
import { contactService } from '../../services/blogService.js';

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user already dismissed the popup in this session
    const dismissed = sessionStorage.getItem('st_lead_popup_dismissed');
    if (dismissed) return;

    // Trigger popup after 2.5 to 3 seconds
    const timer = setTimeout(() => {
      setOpen(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem('st_lead_popup_dismissed', '1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fullMessage = form.phone
        ? `${form.message}\n\nPhone: ${form.phone}`
        : form.message;

      await contactService.send({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: 'Website Lead Popup Inquiry',
        message: fullMessage.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        close();
      }, 3500);
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="lead-modal-backdrop" onClick={close}>
      <div className="lead-modal-card panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="lead-modal-close"
          onClick={close}
          aria-label="Close"
        >
          ✕
        </button>

        {success ? (
          <div className="lead-modal-success">
            <span style={{ fontSize: '2.5rem' }}>🎉</span>
            <h3>Thank You!</h3>
            <p>
              Your inquiry has been received directly by Shailendra Technology.
              We will contact you within 24 hours!
            </p>
            <button type="button" className="btn" onClick={close} style={{ marginTop: '1rem' }}>
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="lead-modal-header">
              <span className="lead-badge">✨ Let's Build Together</span>
              <h2>Start Your Project Today</h2>
              <p className="lead-sub">
                Looking for high-performance web development, custom APIs, or AI solutions?
                Get a free consultation & roadmap for your project.
              </p>
            </div>

            <form className="form lead-form" onSubmit={handleSubmit}>
              <div className="form-row-2">
                <label>
                  Your Name
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                </label>
                <label>
                  Email Address
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </label>
              </div>

              <label>
                Phone Number (optional)
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 93058..."
                />
              </label>

              <label>
                What are you looking to build?
                <textarea
                  rows={3}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us briefly about your website, app, or automation idea..."
                />
              </label>

              {error && <p className="err" role="alert">{error}</p>}

              <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Submitting…' : 'Get Free Consultation →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
