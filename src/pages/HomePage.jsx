import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { featuredSlides, portfolioItems } from '../data';

function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((v) => (v + 1) % featuredSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${featuredSlides[index].src})` }}>
        <div className="hero-overlay" />
        <div className="container hero-content fade-in">
          <h1>Capturing Moments, Creating Stories</h1>
          <div className="cta-row">
            <Link className="btn" to="/portfolio">View Portfolio</Link>
            <Link className="btn" to="/contact">Book a Shoot</Link>
            <Link className="btn btn-outline" to="/about">Learn More</Link>
          </div>
          <div className="carousel-controls">
            <button onClick={() => setIndex((index - 1 + featuredSlides.length) % featuredSlides.length)}>←</button>
            <span>{featuredSlides[index].title}</span>
            <button onClick={() => setIndex((index + 1) % featuredSlides.length)}>→</button>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2>Featured Highlights</h2>
        <div className="highlights-grid">
          {portfolioItems.slice(0, 4).map((item) => (
            <Link key={item.id} to="/portfolio" className="highlight-card">
              <img src={item.src} alt={item.title} />
              <div className="overlay"><h3>{item.title}</h3></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container about-snippet">
        <h2>About Nanox</h2>
        <p>
          Nanox is the creative portfolio of Steve Irankunda, an artistic photographer passionate
          about capturing moments that speak to the heart.
        </p>
        <Link className="btn" to="/about">Learn More</Link>
      </section>
    </>
  );
}

export default HomePage;
