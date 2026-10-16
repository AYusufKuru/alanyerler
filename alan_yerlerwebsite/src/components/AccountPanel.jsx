import React, { useEffect, useState } from 'react';
import { deleteAccount, loadAccount, loadAccountPage, loadSales, updateAccount } from '../api';

const pages = [
  ['help', 'Yardım / Destek'],
  ['faq', 'Sıkça Sorulan Sorular'],
  ['privacy', 'Gizlilik Politikası'],
  ['terms', 'Kullanım Koşulları'],
  ['kvkk', 'KVKK'],
];

export default function AccountPanel({ token, onLogout }) {
  const [account, setAccount] = useState(null);
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([loadAccount(token), loadSales(token)])
      .then(([profile, rows]) => {
        if (!active) return;
        setAccount(profile);
        setName(profile.name || '');
        setPhone(profile.phone || '');
        setSales(Array.isArray(rows) ? rows : []);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Hesap okunamadı.');
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function saveAccount(body) {
    setError('');
    const next = await updateAccount(token, body);
    setAccount(next);
    setNotice('Kaydedildi.');
  }

  async function openPage(key) {
    setError('');
    setPage(await loadAccountPage(key));
  }

  async function removeAccount() {
    setError('');
    await deleteAccount(token, password);
    onLogout();
  }

  if (!account) return <p>{error || 'Hesap yükleniyor.'}</p>;

  return (
    <div className="account-panel">
      {error && <p className="offer-accept-error">{error}</p>}
      {notice && <p>{notice}</p>}

      <section>
        <h3>Hesap bilgilerim</h3>
        <label>
          Ad
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <p>{account.email}</p>
        <button type="button" onClick={() => saveAccount({ name }).catch(showError(setError))}>Kaydet</button>
      </section>

      <section>
        <h3>Telefon numarası</h3>
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="5xxxxxxxxx" />
        <button type="button" onClick={() => saveAccount({ phone }).catch(showError(setError))}>Telefonu kaydet</button>
      </section>

      <section>
        <h3>Telefon doğrulama</h3>
        <p>{account.phone || 'Telefon kayıtlı değil'}</p>
        <p>{account.phoneVerified ? 'Doğrulandı' : 'Doğrulanmadı'}</p>
        <p>{account.phoneVerification}</p>
      </section>

      <section>
        <h3>Satış geçmişim</h3>
        {sales.length === 0 && <p>Kabul edilmiş satış yok.</p>}
        {sales.map((sale) => (
          <p key={sale.id}>
            {sale.title}
            {sale.storeName ? ` · ${sale.storeName}` : ''}
            {sale.price != null ? ` · ${Number(sale.price).toLocaleString('tr-TR')} TL` : ''}
            {sale.saleLabel ? ` · ${sale.saleLabel}` : ''}
          </p>
        ))}
      </section>

      <section>
        <h3>Değerlendirmelerim</h3>
        <p>Mağaza değerlendirmesi henüz hesaba yazılmıyor.</p>
      </section>

      <section>
        <h3>Favori mağazalar</h3>
        <p>Mağaza takibi henüz hesaba yazılmıyor.</p>
      </section>

      <section>
        <h3>Bildirim ayarları</h3>
        <label>
          <input
            type="checkbox"
            checked={account.notifyOffers}
            onChange={(event) => saveAccount({ notifyOffers: event.target.checked }).catch(showError(setError))}
          />
          Teklif bildirimleri
        </label>
        <label>
          <input
            type="checkbox"
            checked={account.notifyMessages}
            onChange={(event) => saveAccount({ notifyMessages: event.target.checked }).catch(showError(setError))}
          />
          Mesaj bildirimi tercihi
        </label>
        <p>{account.messageNotices}</p>
      </section>

      {pages.map(([key, label]) => (
        <button key={key} type="button" className="account-page-link" onClick={() => openPage(key).catch(showError(setError))}>
          {label}
        </button>
      ))}
      {page && (
        <section>
          <h3>{page.title}</h3>
          {page.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      )}

      <section>
        <h3>Hesabımı sil</h3>
        <p>İlanlar, fotoğraflar, mesajlar ve bildirimler silinir. Bu işlem geri alınmaz.</p>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre" />
        <button type="button" onClick={() => removeAccount().catch(showError(setError))}>Hesabımı sil</button>
      </section>
    </div>
  );
}

function showError(setError) {
  return (reason) => setError(reason instanceof Error ? reason.message : 'İşlem tamamlanamadı.');
}
