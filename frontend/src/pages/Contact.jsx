import ContactForm from '../components/contact/ContactForm.jsx';
import { site } from '../config/site.js';

export default function Contact() {
  return (
    <section className="section">
      <div className="container contact-grid">
        <div>
          <h1>Contact</h1>
          <p className="lead">Tell us what you want to build. We reply within one working day.</p>
          <ul className="details">
            <li><strong>Email</strong><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><strong>Phone</strong><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>
            <li><strong>Location</strong>{site.location}</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
