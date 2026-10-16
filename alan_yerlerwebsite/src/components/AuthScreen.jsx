import React, { useState } from 'react';
import { login, register, saveSession } from '../api';

export default function AuthScreen({ onCancel, onSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Geçerli bir e-posta girin.');
      return;
    }
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalı.');
      return;
    }
    if (isRegister) {
      if (name.trim().length < 2) {
        setError('Ad soyad en az 2 karakter olmalı.');
        return;
      }
      if (password !== confirm) {
        setError('Şifreler aynı değil.');
        return;
      }
    }

    setBusy(true);
    setError('');
    try {
      const session = isRegister
        ? await register(name.trim(), cleanEmail, password)
        : await login(cleanEmail, password);
      saveSession(session);
      onSuccess(session);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Giriş tamamlanamadı.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wizard-page-view">
      <div className="wizard-card-box">
        <div className="wizard-card-topbar">
          <button className="wizard-top-back-btn" onClick={onCancel} aria-label="Geri" type="button">
            ←
          </button>
          <h2 className="wizard-top-title">{isRegister ? 'Kayıt ol' : 'Giriş yap'}</h2>
          <button className="wizard-top-cancel-btn" onClick={onCancel} type="button">
            Kapat
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="auth-lead">
            Mobil uygulamadaki hesap burada da geçerlidir. Cihaz satmak, teklifleri ve mesajları görmek için giriş gerekir.
          </p>

          {isRegister && (
            <label className="wizard-form-cell">
              <span className="wizard-cell-label">Ad soyad</span>
              <input
                className="wizard-select-control"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>
          )}

          <label className="wizard-form-cell">
            <span className="wizard-cell-label">E-posta</span>
            <input
              className="wizard-select-control"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="wizard-form-cell">
            <span className="wizard-cell-label">Şifre</span>
            <input
              className="wizard-select-control"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </label>

          {isRegister && (
            <label className="wizard-form-cell">
              <span className="wizard-cell-label">Şifre tekrar</span>
              <input
                className="wizard-select-control"
                type="password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
              />
            </label>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button className="wizard-primary-submit-btn" type="submit" disabled={busy}>
            {busy ? 'Bekleyin…' : isRegister ? 'Hesap oluştur' : 'Giriş yap'}
          </button>

          <button
            className="auth-switch"
            type="button"
            onClick={() => {
              setIsRegister((value) => !value);
              setError('');
            }}
          >
            {isRegister ? 'Hesabım var, giriş yapayım' : 'Hesabım yok, kayıt olayım'}
          </button>
        </form>
      </div>
    </div>
  );
}
