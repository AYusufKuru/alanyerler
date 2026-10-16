import React from 'react';

export default function SaleStatus({ sale }) {
  if (!sale?.steps?.length) return null;
  return (
    <section className="sale-status">
      <h3>Satış Durumu</h3>
      <ol>
        {sale.steps.map((step) => (
          <li key={step.key} className={step.state}>
            {step.state === 'done' ? '✓ ' : ''}
            {step.label}
          </li>
        ))}
      </ol>
    </section>
  );
}
