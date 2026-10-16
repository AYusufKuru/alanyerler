import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import Step1Category from './Step1Category';
import Step2Specs from './Step2Specs';
import Step3Condition from './Step3Condition';
import Step4Photos from './Step4Photos';
import { loadCategories, submitListing } from '../../api';
import { buildListing } from '../../listingMap';
import { defaultSpecs } from '../../data/wizardData';
import ListingReady, { deviceLine } from './ListingReady';

export default function SellWizard({ token, initialCategory, initialSpecs, initialCondition, onCancel, onComplete }) {
  const startCategory = initialCategory || 'laptop';
  const [currentStep, setCurrentStep] = useState(initialCategory ? 2 : 1);
  const [category, setCategory] = useState(startCategory);
  const [specs, setSpecs] = useState(initialSpecs || defaultSpecs(startCategory));
  const [condition, setCondition] = useState({
    batteryHealth: initialCondition?.batteryHealth || "%100 (Orijinal)",
    ssdHealth: initialCondition?.ssdHealth || "%100 Sağlık",
    box: initialCondition?.box ?? initialCondition?.boxAndInvoice ?? true,
    invoice: initialCondition?.invoice ?? initialCondition?.boxAndInvoice ?? true,
    warranty: initialCondition?.warranty || "6 - 12 Ay",
    cosmetic: initialCondition?.cosmetic || "kusursuz",
    cosmeticLabel: initialCondition?.cosmeticLabel || "Kusursuz",
    adapter: initialCondition?.adapter || "Orijinal",
    workingState: initialCondition?.workingState || "perfect",
    notes: ""
  });
  const [photos, setPhotos] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [ready, setReady] = useState(null);

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

  const handleSubmit = async () => {
    const files = photos.map((photo) => photo?.file).filter(Boolean);
    if (files.length < 2) {
      setSubmitError('En az 2 fotoğraf seçin.');
      return;
    }
    setSubmitError('');
    try {
      const categories = await loadCategories(token);
      const payload = buildListing(categories, category, specs, condition);
      const listing = await submitListing(token, payload, files);
      const deviceRecord = {
        id: listing.id,
        title: listing.title,
        category,
        specs,
        condition,
        photos: listing.photos.map((photo) => photo.path),
        status: 'collecting_offers',
        createdAt: listing.createdAt,
      };
      setReady(deviceRecord);
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : 'İlan gönderilemedi.');
    }
  };

  if (ready) {
    return (
      <div className="wizard-page-view">
        <div className="wizard-card-box">
          <ListingReady
            deviceLine={deviceLine(ready.title, ready.specs)}
            onOffers={() => onComplete(ready)}
          />
        </div>
      </div>
    );
  }

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
              onSelectCategory={(id) => {
                setCategory(id);
                setSpecs(defaultSpecs(id));
              }}
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
              error={submitError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
