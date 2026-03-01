import { useEffect, useState } from 'react';

const fallback = {
  headline: 'Privacy Policy',
  sections: [
    {
      title: 'Introduction',
      body: 'We respect your privacy. Any personal information collected on this website is used solely to respond to inquiries and provide services.',
    },
    {
      title: 'Information Collection',
      body: 'We may collect your name, email address, and phone number through contact forms or newsletter sign-ups.',
    },
    {
      title: 'Use of Information',
      body: 'Collected information is only used to contact you regarding your inquiries, bookings, or services.',
    },
    {
      title: 'Data Protection',
      body: 'We take reasonable measures to protect your information from unauthorized access.',
    },
    {
      title: 'Third-Party Services',
      body: 'Links to social media or third-party platforms (e.g., Facebook) may collect data independently. We are not responsible for their privacy practices.',
    },
    {
      title: 'Cookies',
      body: 'This website may use cookies to enhance user experience. No personal data is sold or shared with third parties.',
    },
  ],
};

function PrivacyPolicyPage() {
  const [content, setContent] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPolicy() {
      try {
        const response = await fetch('/api/privacy-policy');
        if (!response.ok) throw new Error('failed');
        const payload = await response.json();
        if (active && payload?.data) setContent(payload.data);
      } catch {
        if (active) setContent(fallback);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPolicy();
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
        <h1>Loading Privacy Policy…</h1>
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

export default PrivacyPolicyPage;
