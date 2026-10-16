import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { WIZARD_CATEGORIES } from '../../data/wizardData';

export default function Step1Category({ selectedCategory, onSelectCategory, onNext }) {
  return (
    <div className="wizard-substep-block">
      <div className="wizard-substep-head">
        <h3 className="wizard-substep-title">Hangi cihazı satmak istiyorsunuz?</h3>
        <p className="wizard-substep-desc">
          Cihazınızı seçin, bilgilerinizi doldurun ve işletmelerden gelen teklifleri alın.
        </p>
      </div>

      <div className="wizard-cat-grid">
        {WIZARD_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div 
              key={cat.id}
              className={`wizard-cat-tile ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <div className="wizard-cat-icon-container">
                <img src={cat.image} alt={cat.name} className="wizard-cat-image" />
              </div>

              <div className="wizard-cat-label-group">
                <span className="wizard-cat-label-title">{cat.name}</span>
                <span className="wizard-cat-label-desc" title={cat.desc}>{cat.desc}</span>
              </div>

              <div className={`wizard-cat-check-badge ${isSelected ? 'checked' : ''}`}>
                {isSelected ? <Check size={15} strokeWidth={3} /> : <ArrowRight size={15} />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="wizard-footer-action-bar">
        <button 
          className="wizard-primary-submit-btn"
          disabled={!selectedCategory}
          onClick={onNext}
        >
          <span>Devam Et</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
