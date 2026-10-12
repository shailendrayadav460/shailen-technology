import { useEffect, useRef, useState } from 'react';
import { aiService, contactService } from '../../services/blogService.js';

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: 'Hello! 👋 I am Shailendra Technology\'s AI Assistant. Ask me anything about our services, tech stack, or click below to leave your project inquiry directly.',
  },
];

const SUGGESTIONS = [
  'What services do you offer?',
  'Which tech stack do you use?',
  'How do I start a project?',
];

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactErr, setContactErr] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, showContactForm]);

  const send = async (msgText) => {
    const textToSend = (msgText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = { role: 'user', text: textToSend };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const history = nextMessages.slice(1, -1);
      const res = await aiService.chat(textToSend, history);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.reply, isDemo: res.isDemo },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I had trouble connecting. Please try again or click "Send Inquiry" to contact us directly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactErr('');

    try {
      await contactService.send({
        name: contactData.name.trim(),
        email: contactData.email.trim(),
        subject: 'Inquiry via AI Chatbot',
        message: contactData.message.trim(),
      });

      setShowContactForm(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `✅ Thank you, ${contactData.name}! Your message and contact details have been successfully submitted to Shailendra Technology. Our team will contact you at ${contactData.email} soon.`,
        },
      ]);
      setContactData({ name: '', email: '', message: '' });
    } catch (err) {
      setContactErr(err.message || 'Failed to submit details. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send();
  };

  return (
    <div className="ai-widget-container">
      {/* Floating Trigger Tag / Button */}
      {!open && (
        <button
          type="button"
          className="ai-floating-trigger"
          onClick={() => setOpen(true)}
          aria-label="Open AI Assistant"
        >
          <span className="ai-trigger-sparkle">✨</span>
          <span className="ai-trigger-text">Ask AI</span>
          <span className="ai-trigger-dot" title="AI Ready"></span>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="ai-chat-window panel">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <span className="ai-header-icon">✨</span>
              <div>
                <strong>Shailendra AI</strong>
                <span className="ai-header-status">
                  <span className="status-dot"></span> Ready to help
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                className="ai-inquiry-toggle-btn"
                onClick={() => setShowContactForm(!showContactForm)}
                title="Send contact details"
              >
                {showContactForm ? '💬 Chat' : '📩 Leave Inquiry'}
              </button>
              <button
                type="button"
                className="ai-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close AI Chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Contact Details Form Mode inside AI */}
          {showContactForm ? (
            <div className="ai-contact-mode">
              <div style={{ marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.05rem', color: 'var(--gold-light)' }}>
                  📩 Leave Your Project Details
                </h4>
                <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>
                  Send your inquiry directly to our database and team:
                </p>
              </div>

              <form className="form" onSubmit={handleContactSubmit}>
                <label style={{ fontSize: '0.85rem' }}>
                  Your Name
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    style={{ padding: '0.5rem 0.65rem', fontSize: '0.88rem' }}
                  />
                </label>

                <label style={{ fontSize: '0.85rem' }}>
                  Email Address
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    style={{ padding: '0.5rem 0.65rem', fontSize: '0.88rem' }}
                  />
                </label>

                <label style={{ fontSize: '0.85rem' }}>
                  Project Details / Message
                  <textarea
                    rows={3}
                    required
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    placeholder="Briefly describe what you want to build..."
                    style={{ padding: '0.5rem 0.65rem', fontSize: '0.88rem' }}
                  />
                </label>

                {contactErr && <p className="err" role="alert" style={{ fontSize: '0.82rem' }}>{contactErr}</p>}

                <div className="row" style={{ marginTop: '0.4rem' }}>
                  <button type="submit" className="btn" disabled={contactSubmitting} style={{ flex: 1, padding: '0.55rem 1rem' }}>
                    {contactSubmitting ? 'Submitting…' : 'Submit Details →'}
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => setShowContactForm(false)}
                    style={{ padding: '0.55rem 0.8rem' }}
                  >
                    Back to Chat
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="ai-messages-body">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`ai-message ${m.role === 'user' ? 'user' : 'assistant'}`}
                  >
                    <div className="ai-bubble">
                      <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="ai-message assistant">
                    <div className="ai-bubble typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Quick suggestions */}
              {messages.length <= 3 && !loading && (
                <div className="ai-suggestions">
                  <button
                    type="button"
                    className="ai-suggestion-chip inquiry-chip"
                    onClick={() => setShowContactForm(true)}
                  >
                    📩 Leave Details / Contact Us
                  </button>
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className="ai-suggestion-chip"
                      onClick={() => send(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form className="ai-input-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything or request a service..."
                  disabled={loading}
                  maxLength={500}
                />
                <button type="submit" className="btn" disabled={loading || !input.trim()}>
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
