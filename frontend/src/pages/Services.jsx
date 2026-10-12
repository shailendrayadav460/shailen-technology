import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteService } from '../services/blogService.js';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    siteService
      .services()
      .then((data) => {
        if (alive) setServices(data.services || []);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="section">
      <div className="container narrow">
        <h1>Services</h1>
        <p className="lead">Everything needed to take a website from idea to a running product.</p>

        {loading && services.length === 0 && <p className="muted">Loading services from database…</p>}

        <div className="stack">
          {services.map((s) => (
            <article className="card" key={s._id || s.title}>
              <h3>
                {s.icon ? `${s.icon} ` : ''}
                {s.title}
                {s.status === 'soon' && <span className="tag">Soon</span>}
              </h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>

        <p style={{ marginTop: '2rem' }}>
          <Link className="btn" to="/contact">
            Talk to us
          </Link>
        </p>
      </div>
    </section>
  );
}
