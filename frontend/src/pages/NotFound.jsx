import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section"><div className="container narrow">
      <h1>Page not found</h1>
      <p><Link to="/">Go to the home page</Link></p>
    </div></section>
  );
}
