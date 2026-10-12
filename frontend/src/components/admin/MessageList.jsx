import { formatDate } from '../blog/PostCard.jsx';

export default function MessageList({ messages, onRead, onDelete }) {
  if (!messages.length) return <p className="muted">No messages yet.</p>;
  return (
    <ul className="messages">
      {messages.map((m) => (
        <li key={m._id} className={m.read ? 'panel' : 'panel unread'}>
          <p className="meta">{formatDate(m.createdAt)} · {m.name} · <a href={`mailto:${m.email}`}>{m.email}</a></p>
          {m.subject && <h4>{m.subject}</h4>}
          <p className="pre">{m.message}</p>
          <div className="row">
            {!m.read && <button className="link" onClick={() => onRead(m)}>Mark as read</button>}
            <button className="link danger" onClick={() => onDelete(m)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
