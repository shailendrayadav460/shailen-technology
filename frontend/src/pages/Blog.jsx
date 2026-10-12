import { useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/blog/PostCard.jsx';
import PostForm from '../components/admin/PostForm.jsx';
import { useBlog } from '../context/BlogContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { adminService } from '../services/adminService.js';

export default function Blog() {
  const { posts, status, refresh, page, totalPages, goToPage } = useBlog();
  const { admin } = useAuth();
  const [editing, setEditing] = useState(null); // null | 'new' | post object
  const [error, setError] = useState('');

  const canManage = Boolean(admin) && status === 'online';

  async function save(data) {
    if (editing === 'new') await adminService.createPost(data);
    else await adminService.updatePost(editing._id, data);
    setEditing(null);
    setError('');
    await refresh(page);
  }

  async function remove(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await adminService.deletePost(post._id);
      await refresh(page);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section">
      <div className="container narrow">
        <div className="blog-head">
          <h1>Blog</h1>
          {canManage && !editing && (
            <button type="button" className="btn" onClick={() => setEditing('new')}>
              Write a new post
            </button>
          )}
        </div>

        {admin && (
          <div className="admin-bar">
            <p>
              Signed in as <strong>{admin.email}</strong>.
            </p>
            <Link to="/admin">Dashboard (drafts, services & messages)</Link>
            {status === 'offline' && <p className="err">Server unreachable, so posting is paused.</p>}
          </div>
        )}

        {error && <p className="err" role="alert">{error}</p>}

        {canManage && editing ? (
          <PostForm
            key={editing === 'new' ? 'new' : editing._id}
            initial={editing === 'new' ? null : editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <>
            {status === 'loading' && <p className="muted">Loading latest posts…</p>}
            {status !== 'loading' && posts.length === 0 && (
              <p className="muted">No posts available yet.</p>
            )}

            <div className="stack">
              {posts.map((p) => (
                <PostCard
                  key={p._id}
                  post={p}
                  onEdit={canManage ? setEditing : undefined}
                  onDelete={canManage ? remove : undefined}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                className="pagination-bar"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '2.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <button
                  type="button"
                  className="btn ghost"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  style={{ opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  ← Previous
                </button>
                <span className="meta" style={{ fontWeight: 600 }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn ghost"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                  style={{ opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
