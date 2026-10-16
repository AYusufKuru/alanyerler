import React, { useEffect, useState } from 'react';

const slides = [
  { src: '/assets/banner.png', alt: 'Cihazının değerini öğren' },
  { src: '/assets/banner-2.png', alt: 'Kullanmadığın cihazlar değerinde alıcıyla buluşsun' },
];

export default function Hero({ onStartSelling }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const show = (next) => {
    setIndex((next + slides.length) % slides.length);
  };

  return (
    <section className="hero-wrapper" id="anasayfa">
      <div className="home-banner-slider">
        <div className="home-banner-viewport">
          <div className="home-banner-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((slide) => (
              <button key={slide.src} type="button" className="home-banner-slide" onClick={onStartSelling}>
                <img src={slide.src} alt={slide.alt} />
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="home-banner-arrow prev" onClick={() => show(index - 1)} aria-label="Önceki">
          ‹
        </button>
        <button type="button" className="home-banner-arrow next" onClick={() => show(index + 1)} aria-label="Sonraki">
          ›
        </button>
        <div className="home-banner-dots">
          {slides.map((slide, dot) => (
            <button
              key={slide.src}
              type="button"
              className={dot === index ? 'active' : ''}
              aria-label={`Banner ${dot + 1}`}
              onClick={() => show(dot)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
