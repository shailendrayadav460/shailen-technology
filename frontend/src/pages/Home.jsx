import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero-tech.jpg';
import PostCard from '../components/blog/PostCard.jsx';
import { useBlog } from '../context/BlogContext.jsx';
import { siteService } from '../services/blogService.js';
import { site } from '../config/site.js';

export default function Home() {
  const { posts } = useBlog();
  const [whatWeDo, setWhatWeDo] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([siteService.whatWeDo(), siteService.projects()])
      .then(([wData, pData]) => {
        if (!alive) return;
        setWhatWeDo(wData.items || []);
        setProjects(pData.projects || []);
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
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>{site.tagline}</h1>
            <p className="lead">
              {site.name} designs, builds, and runs full-stack products with React, Node.js, and AI automation,
              from the database to the browser.
            </p>
            <div className="row">
              <Link className="btn" to="/contact">
                Start a project
              </Link>
              <Link className="btn ghost" to="/services">
                See services
              </Link>
            </div>
          </div>
          <div className="hero-mark">
            <img
              src={heroImg}
              alt="Full Stack Development with React, Node.js, MongoDB, and AI"
              className="hero-illustration"
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                display: 'block',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        </div>
      </section>

      {/* Dynamic What We Do from Database */}
      <section className="section">
        <div className="container">
          <h2>What we do</h2>
          {loading && whatWeDo.length === 0 && <p className="muted">Loading…</p>}
          <div className="grid">
            {whatWeDo.map((item) => (
              <article className="card" key={item._id || item.title}>
                <h3>
                  {item.icon ? `${item.icon} ` : ''}
                  {item.title}
                </h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Selected Work from Database */}
      <section className="section alt">
        <div className="container">
          <h2>Selected work</h2>
          {loading && projects.length === 0 && <p className="muted">Loading projects…</p>}
          <div className="grid three">
            {projects.map((p) => (
              <article className="card" key={p._id || p.name}>
                {p.image && (
                  <div style={{ maxHeight: '180px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}
                <h3>{p.name}</h3>
                <p className="meta">{p.stack}</p>
                <p>{p.text}</p>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer">
                    Visit site ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic From the Blog from Database */}
      <section className="section">
        <div className="container">
          <h2>From the blog</h2>
          <div className="grid">
            {posts.slice(0, 2).map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            <Link className="btn ghost" to="/blog">
              View all posts →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
