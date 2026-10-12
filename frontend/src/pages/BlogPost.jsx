import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostBody from '../components/blog/PostBody.jsx';
import { formatDate } from '../components/blog/PostCard.jsx';
import { useBlog } from '../context/BlogContext.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const { getPostBySlug } = useBlog();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let alive = true;
    getPostBySlug(slug).then((p) => alive && setPost(p));
    return () => {
      alive = false;
    };
  }, [slug, getPostBySlug]);

  useEffect(() => {
    if (post) document.title = `${post.title} | Shailendra Technology`;
    return () => {
      document.title = 'Shailendra Technology';
    };
  }, [post]);

  if (post === undefined) return <p className="center-note">Loading…</p>;
  if (post === null)
    return (
      <section className="section">
        <div className="container narrow">
          <h1>Post not found</h1>
          <p>
            <Link to="/blog">Back to the blog</Link>
          </p>
        </div>
      </section>
    );

  return (
    <article className="section">
      <div className="container narrow">
        {/* 1. Cover Image First */}
        {post.cover && (
          <img
            className="cover"
            src={post.cover}
            alt={post.title}
            loading="lazy"
            style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', marginBottom: '1.8rem' }}
          />
        )}

        {/* 2. Title */}
        <h1 style={{ marginBottom: '0.8rem' }}>{post.title}</h1>

        {/* 3. Summary */}
        {post.excerpt && (
          <p className="lead" style={{ fontStyle: 'italic', color: 'var(--muted)', marginBottom: '1.5rem' }}>
            {post.excerpt}
          </p>
        )}

        {/* 4. Content */}
        <PostBody content={post.content} />

        {/* 5. Tags & Meta */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--line)' }}>
          <p className="meta">
            Published: {formatDate(post.createdAt)}
            {post.tags?.length > 0 && (
              <span style={{ marginLeft: '1rem' }}>
                Tags:{' '}
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            <Link className="btn ghost" to="/blog">
              ← Back to all posts
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
