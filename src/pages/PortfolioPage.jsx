import { useEffect, useMemo, useState } from 'react';
import { portfolioItems } from '../data';

const categories = ['All', 'Portrait', 'Event', 'Artistic'];

function PortfolioPage() {
  const [filter, setFilter] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [animateKey, setAnimateKey] = useState(0);

  const list = useMemo(
    () => (filter === 'All' ? portfolioItems : portfolioItems.filter((item) => item.category === filter)),
    [filter]
  );

  useEffect(() => {
    setAnimateKey((v) => v + 1);
  }, [filter]);

  const selected = selectedIndex >= 0 ? list[selectedIndex] : null;

  return (
    <section className="section container">
      <h1>Portfolio</h1>
      <p className="page-subtext">Explore my photography collections</p>

      <div className="filter-row" role="tablist" aria-label="Portfolio categories">
        {categories.map((category) => (
          <button
            key={category}
            role="tab"
            aria-selected={filter === category}
            className={`chip ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div key={animateKey} className="gallery-grid gallery-animate">
        {list.map((item, idx) => (
          <article key={item.id} className="gallery-card" onClick={() => setSelectedIndex(idx)}>
            <img src={item.src} alt={item.title} />
            <div className="overlay">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="lightbox" onClick={() => setSelectedIndex(-1)}>
          <div className="lightbox-content lightbox-animate" onClick={(e) => e.stopPropagation()}>
            <img src={selected.src} alt={selected.title} />
            <h3>{selected.title}</h3>
            <p>{selected.desc}</p>
            <div className="lightbox-controls">
              <button
                className="btn"
                onClick={() => setSelectedIndex((v) => (v - 1 + list.length) % list.length)}
              >
                ← Prev
              </button>
              <button
                className="btn"
                onClick={() => setSelectedIndex((v) => (v + 1) % list.length)}
              >
                Next →
              </button>
              <button className="btn" onClick={() => setSelectedIndex(-1)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PortfolioPage;
