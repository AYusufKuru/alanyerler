import React, { useEffect, useState } from 'react';
import { loadCategories, updateListing } from '../../api';

export default function ListingEdit({ token, listing, onSaved, onClose }) {
  const [fields, setFields] = useState(null);
  const [specs, setSpecs] = useState(listing.specs || {});
  const [condition, setCondition] = useState(listing.condition || {});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    loadCategories(token)
      .then((categories) => {
        if (!active) return;
        const typeId = listing.deviceType?.id || listing.deviceTypeId;
        const match = categories.flatMap((category) => category.deviceTypes || []).find((type) => type.id === typeId);
        setFields(match || null);
        if (!match) setError('Bu ilanın formu bulunamadı.');
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Form alınamadı.');
      });
    return () => {
      active = false;
    };
  }, [token, listing]);

  async function save() {
    setBusy(true);
    setError('');
    try {
      const saved = await updateListing(token, listing.id, { specs, condition });
      onSaved(saved);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'İlan kaydedilemedi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="listing-edit">
      <div className="listing-edit-bar">
        <button type="button" onClick={onClose}>Geri</button>
        <h2>İlanı düzenle</h2>
      </div>
      {listing.offerCount > 0 && <p>Gelen tekliflerin fiyatı aynı kalır.</p>}
      {error && <p className="offer-accept-error">{error}</p>}
      {fields && (
        <>
          <FieldGroup title="Özellikler" fields={fields.specFields} values={specs} onChange={setSpecs} />
          <FieldGroup title="Durum" fields={fields.conditionFields} values={condition} onChange={setCondition} />
          <button type="button" className="btn-offer-accept" disabled={busy} onClick={save}>Kaydet</button>
        </>
      )}
    </div>
  );
}

function FieldGroup({ title, fields = [], values, onChange }) {
  return (
    <section>
      <h3>{title}</h3>
      {fields.map((field) => {
        const value = values[field.key] || '';
        return (
          <label key={field.key}>
            {field.label}
            {field.options ? (
              <select value={value} onChange={(event) => onChange({ ...values, [field.key]: event.target.value })}>
                <option value="">Seçin</option>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : (
              <input value={value} onChange={(event) => onChange({ ...values, [field.key]: event.target.value })} />
            )}
            {value === 'Diğer' && (
              <input
                value={values[`${field.key}Diger`] || ''}
                placeholder="Kendi değerin"
                onChange={(event) => onChange({ ...values, [`${field.key}Diger`]: event.target.value })}
              />
            )}
          </label>
        );
      })}
    </section>
  );
}
