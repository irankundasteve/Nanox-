import { useState } from 'react';

const initial = { name: '', email: '', phone: '', message: '' };

function ContactPage() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setErrors({});

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload?.errors) setErrors(payload.errors);
        else setErrors({ form: payload?.error || 'Something went wrong. Please try again.' });
        return;
      }

      setSuccess('Thanks! Your inquiry has been received. I will get back to you soon.');
      setForm(initial);
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section container contact-page">
      <h1>Contact Me</h1>
      <p className="page-subtext">I’d love to hear from you</p>

      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <label htmlFor="name">Name*</label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <label htmlFor="email">Email*</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label htmlFor="phone">Phone (optional)</label>
        <input
          id="phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}

        <label htmlFor="message">Message*</label>
        <textarea
          id="message"
          rows="5"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && <span className="error">{errors.message}</span>}

        {errors.form && <p className="error">{errors.form}</p>}

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Submit Inquiry'}
        </button>

        {success && <p className="success success-animate">{success}</p>}
      </form>

      <aside className="contact-alt">
        <h2>Alternate Contact</h2>
        <p>
          Email:{' '}
          <a href="mailto:irankundasteve22@gmail.com">irankundasteve22@gmail.com</a>
        </p>
        <p>
          Phone: <a href="tel:+25767622353">+25767622353</a>
        </p>
        <p>
          Facebook:{' '}
          <a href="https://www.facebook.com/profile.php?id=61551810645067" target="_blank" rel="noreferrer">
            Visit Profile
          </a>
        </p>
      </aside>
    </section>
  );
}

export default ContactPage;
