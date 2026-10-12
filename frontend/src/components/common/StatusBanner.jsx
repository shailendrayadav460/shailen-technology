import { useBlog } from '../../context/BlogContext.jsx';

// Visible only when the backend is unreachable. The site keeps working with built-in content.
export default function StatusBanner() {
  const { status, refresh } = useBlog();
  if (status !== 'offline') return null;
  return (
    <div className="banner" role="status">
      <span>Live content is unavailable right now, so you are seeing saved content.</span>
      <button type="button" onClick={refresh}>Try again</button>
    </div>
  );
}
