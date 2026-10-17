import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/marketplaceData';
import { loadSite } from '../api';

export default function CategoriesGrid({ onSelectCategory }) {
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    loadSite()
      .then((site) => {
        if (Array.isArray(site.categories)) setCategories(site.categories);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="categories-container" id="categoriesSection">
      <div className="section-title-wrap">
        <span className="section-tag-blue">— CİHAZ SEÇ</span>
        <h2 className="section-main-heading">Hangi cihazı satmak istiyorsunuz?</h2>
        <p className="section-sub-desc">
          Satmak istediğiniz cihaz kategorisini seçerek doğrulanmış işletmelerden canlı teklifler toplayın.
        </p>
      </div>

      <div className="categories-cards-grid">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className="category-bespoke-card"
            style={{ background: cat.bgTint }}
            onClick={() => onSelectCategory(cat)}
          >
            <div className="card-device-stage">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="card-device-img" 
                loading="lazy" 
              />
            </div>

            <div className="card-bottom-row">
              <div className="card-title-group">
                <h3>{cat.name}</h3>
                <p>{cat.subTitle}</p>
              </div>
              <div className="card-arrow-circle">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
