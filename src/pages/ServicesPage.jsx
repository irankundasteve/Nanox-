import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const fallback = [
  {
    title: 'Portrait Sessions',
    description: 'Individual, couple, and family portrait sessions with guided direction and natural-light styling.',
    details: 'Perfect for personal branding, family keepsakes, and creative portraits tailored to your mood and style.',
    pricing: 'Starting at $180 • 60–90 minutes',
  },
  {
    title: 'Event Photography',
    description: 'Coverage for celebrations, gatherings, and milestone events with candid storytelling and edited highlights.',
    details: 'From intimate ceremonies to larger events, coverage is designed around your timeline and key moments.',
    pricing: 'Custom quote • Half-day and full-day options',
  },
  {
    title: 'Artistic Editorial Work',
    description: 'Creative concept shoots with mood, styling, and composition crafted for visual impact and storytelling.',
    details: 'Collaborative pre-production with references, lighting direction, and a final curated image set.',
    pricing: 'Starting at $250 • Concept + production support',
  },
];

function ServicesPage() {
  const [services, setServices] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadServices() {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('failed');
        const payload = await response.json();
        if (active && Array.isArray(payload?.data) && payload.data.length) {
          setServices(payload.data);
        }
      } catch {
        if (active) setServices(fallback);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadServices();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const sections = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <section className="section container services-page">
        <h1>Services</h1>
        <p className="page-subtext">Loading services…</p>
      </section>
    );
  }

  return (
    <section className="section container services-page">
      <h1>Services</h1>
      <p className="page-subtext">Discover what I offer and how I work with clients</p>

      <div className="accordion reveal-on-scroll">
        {services.map((service, i) => {
          const expanded = open === i;
          return (
            <article className={`accordion-item ${expanded ? 'expanded' : ''}`} key={service._id || service.title}>
              <button
                className="accordion-trigger"
                onClick={() => setOpen(expanded ? -1 : i)}
                aria-expanded={expanded}
              >
                <span>{service.title}</span>
                <span aria-hidden="true">{expanded ? '−' : '+'}</span>
              </button>
              <div className="accordion-panel">
                <p>{service.description}</p>
                {service.details && <p>{service.details}</p>}
                {service.pricing && <p className="service-meta">{service.pricing}</p>}
              </div>
            </article>
          );
        })}
      </div>

      <div className="services-cta reveal-on-scroll">
        <Link className="btn" to="/contact">Book a Shoot</Link>
      </div>
    </section>
  );
}

export default ServicesPage;
