import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const fallback = {
  headline: 'Capturing Moments, Creating Stories',
  introParagraph:
    'Nanox is the creative portfolio of Steve Irankunda, an artistic photographer passionate about capturing moments that speak to the heart. Every image reflects emotion, light, and connection, blending artistry with personal storytelling.',
  artisticVision:
    'Photography is more than just a picture—it’s a feeling frozen in time. My work focuses on authentic emotion, natural light, and timeless compositions. I aim to create images that evoke memories, intimacy, and beauty in every frame.',
  experienceCredentials:
    'With over 5 years of experience in portrait, event, and artistic photography, my work has been featured across exhibitions in North America and beyond. I continuously explore new techniques to capture the essence of every subject.',
  ctaText: 'Book a Shoot',
  ctaLink: '/contact',
};

function AboutPage() {
  const [content, setContent] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadAboutContent() {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) throw new Error('Failed to fetch about content');
        const payload = await response.json();
        if (active && payload?.data) setContent(payload.data);
      } catch {
        if (active) setContent(fallback);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAboutContent();

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
      <section className="section container about-page">
        <h1>Loading About Content…</h1>
        <p className="page-subtext">Please wait while we fetch the latest story.</p>
      </section>
    );
  }

  return (
    <section className="section container text-page about-page">
      <h1>{content.headline}</h1>

      <p className="about-block reveal-on-scroll">{content.introParagraph}</p>

      <section className="about-block reveal-on-scroll">
        <h2>Artistic Vision</h2>
        <p>{content.artisticVision}</p>
      </section>

      <section className="about-block reveal-on-scroll">
        <h2>Experience & Credentials</h2>
        <p>{content.experienceCredentials}</p>
      </section>

      <div className="about-cta reveal-on-scroll">
        <Link className="btn" to={content.ctaLink}>{content.ctaText}</Link>
      </div>
    </section>
  );
}

export default AboutPage;
