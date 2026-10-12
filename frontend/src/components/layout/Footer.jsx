import { site } from '../../config/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <p>&copy; {new Date().getFullYear()} {site.name}</p>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a> &nbsp;|&nbsp; {site.location}
        </p>
        <p>
          <a href={site.github} target="_blank" rel="noreferrer">GitHub</a> &nbsp;|&nbsp;{' '}
          <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
      </div>
    </footer>
  );
}
