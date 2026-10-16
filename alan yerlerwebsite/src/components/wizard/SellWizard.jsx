import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Step1Category from './Step1Category';
import Step2Specs from './Step2Specs';
import Step3Condition from './Step3Condition';
import Step4Photos from './Step4Photos';

export default function SellWizard({ initialCategory, initialSpecs, initialCondition, onCancel, onComplete }) {
  const [currentStep, setCurrentStep] = useState(initialCategory ? 2 : 1);
  const [category, setCategory] = useState(initialCategory || "laptop");
  const [specs, setSpecs] = useState(initialSpecs || {
    brand: "Apple",
    series: "MacBook Pro",
    model: "MacBook Pro 14\" (2023)",
    cpu: "M2 Pro",
    gpu: "Dahili (Apple GPU)",
    ram: "16 GB",
    storage: "512 GB SSD",
    screenSize: "14 inç"
  });
  const [condition, setCondition] = useState({
    batteryHealth: initialCondition?.batteryHealth || "%100 (Orijinal)",
    ssdHealth: initialCondition?.ssdHealth || "%100 Sağlık",
    boxAndInvoice: initialCondition?.boxAndInvoice !== undefined ? initialCondition.boxAndInvoice : true,
    warranty: initialCondition?.warranty || "6 - 12 Ay",
    cosmetic: initialCondition?.cosmetic || "flawless",
    cosmeticLabel: initialCondition?.cosmeticLabel || "Sıfır Gibi",
    adapter: initialCondition?.adapter || "Orijinal",
    workingState: initialCondition?.workingState || "perfect",
    notes: ""
  });
  const [photos, setPhotos] = useState([]);

  const stepLabels = [
    { num: 1, title: "Cihaz Türü" },
    { num: 2, title: "Özellikler" },
    { num: 3, title: "Durum" },
    { num: 4, title: "Fotoğraflar" }
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else onCancel();
  };

  const handleSubmit = () => {
    const deviceRecord = {
      id: `dev-${Date.now()}`,
      category,
      specs,
      condition,
      photos,
      status: "collecting_offers",
      createdAt: new Date().toISOString()
    };

    // Kalıcı yerel depolamaya kaydet
    const existing = JSON.parse(localStorage.getItem('alan_yerler_devices') || '[]');
    existing.unshift(deviceRecord);
    localStorage.setItem('alan_yerler_devices', JSON.stringify(existing));

    onComplete(deviceRecord);
  };

  return (
    <div className="wizard-page-view">
      <div className="wizard-card-box">
        {/* Üst Navigasyon: Geri | Cihaz Sat | İptal */}
        <div className="wizard-card-topbar">
          <button className="wizard-top-back-btn" onClick={handleBack} aria-label="Geri">
            <ArrowLeft size={18} />
          </button>
          
          <h2 className="wizard-top-title">Cihaz Sat</h2>

          <button className="wizard-top-cancel-btn" onClick={onCancel}>
            İptal
          </button>
        </div>

        {/* 4 Aşamalı Dinamik Stepper */}
        <div className="wizard-stepper-container">
          {stepLabels.map((s, index) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <div 
                  className={`wizard-step-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => { if (isCompleted) setCurrentStep(s.num); }}
                >
                  <div className="wizard-step-badge">
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : s.num}
                  </div>
                  <span className="wizard-step-name">{s.title}</span>
                </div>
                {index < stepLabels.length - 1 && (
                  <div className={`wizard-step-connector ${currentStep > s.num ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Adım İçeriği (Tek ve sade kart gövdesi) */}
        <div className="wizard-step-content-pane">
          {currentStep === 1 && (
            <Step1Category 
              selectedCategory={category}
              onSelectCategory={setCategory}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2Specs 
              category={category}
              specs={specs}
              onChangeSpecs={setSpecs}
              onBack={handleBack}
              onNext={handleNext}
              onResetCategory={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Condition 
              category={category}
              condition={condition}
              onChangeCondition={setCondition}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {currentStep === 4 && (
            <Step4Photos 
              category={category}
              specs={specs}
              condition={condition}
              photos={photos}
              onPhotosChange={setPhotos}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
