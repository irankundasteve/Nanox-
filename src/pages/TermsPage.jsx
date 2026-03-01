import { useEffect, useState } from 'react';

const fallback = {
  headline: 'Terms of Service',
  sections: [
    {
      title: 'Scope of Services',
      body: 'Nanox provides artistic photography services as described on this website. All services are subject to availability and confirmation.',
    },
    {
      title: 'Booking & Payment',
      body: 'Clients are responsible for confirming bookings and fulfilling any agreed payments.',
    },
    {
      title: 'Intellectual Property',
      body: 'All photographs displayed on this website are the property of Nanox. Unauthorized use, reproduction, or distribution is prohibited.',
    },
    {
      title: 'Liability',
      body: 'Nanox is not liable for any damages arising from the use of this website or its content.',
    },
    {
      title: 'Governing Law',
      body: 'These terms are governed by the laws of your country of residence.',
    },
  ],
};

function TermsPage() {
  const [content, setContent] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTerms() {
      try {
        const response = await fetch('/api/terms-of-service');
        if (!response.ok) throw new Error('failed');
        const payload = await response.json();
        if (active && payload?.data) setContent(payload.data);
      } catch {
        if (active) setContent(fallback);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTerms();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const nodes = document.querySelectorAll('.reveal-on-scroll');
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

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <section className="section container legal-page">
        <h1>Loading Terms of Service…</h1>
      </section>
    );
  }

  return (
    <section className="section container legal-page">
      <h1>{content.headline}</h1>

      {content.sections.map((section) => (
        <section key={section.title} className="legal-block reveal-on-scroll">
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </section>
  );
}

export default TermsPage;
