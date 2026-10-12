import { Link } from 'react-router-dom';

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PostCard({ post, onEdit, onDelete }) {
  return (
    <article className="post-card">
      {/* 1. Cover Image First */}
      {post.cover && (
        <div className="post-card-img" style={{ overflow: 'hidden', maxHeight: '220px', marginBottom: '1rem' }}>
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}
      <div className="post-card-body">
        {/* 2. Title */}
        <h3 style={{ margin: '0 0 0.5rem' }}>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* 3. Summary */}
        <p style={{ margin: '0 0 0.8rem', color: 'var(--ivory)' }}>{post.excerpt}</p>

        {/* 4. Tags & Meta */}
        <p className="meta" style={{ fontSize: '0.85rem' }}>
          {formatDate(post.createdAt)}
          {post.tags?.length ? ` · ${post.tags.join(', ')}` : ''}
        </p>

        {(onEdit || onDelete) && (
          <div className="card-tools">
            {onEdit && (
              <button type="button" className="link" onClick={() => onEdit(post)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button type="button" className="link danger" onClick={() => onDelete(post)}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
