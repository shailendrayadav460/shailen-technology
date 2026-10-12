import { formatDate } from '../blog/PostCard.jsx';

export default function PostTable({ posts, onEdit, onDelete }) {
  if (!posts.length) return <p className="muted">No posts yet. Create your first one.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Title</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>{p.published ? 'Published' : 'Draft'}</td>
              <td>{formatDate(p.createdAt)}</td>
              <td className="actions">
                <button className="link" onClick={() => onEdit(p)}>Edit</button>
                <button className="link danger" onClick={() => onDelete(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
