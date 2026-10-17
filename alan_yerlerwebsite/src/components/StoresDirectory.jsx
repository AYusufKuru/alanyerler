import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { loadSite, mediaUrl } from '../api';

export default function StoresDirectory({ onStartChat, onOpenStore }) {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => {
    loadSite()
      .then((site) => {
        setStores(Array.isArray(site.stores) ? site.stores : []);
      })
      .catch(() => setStores([]));
  }, []);

  const filtered = stores.filter(store => {
    const name = store.name || '';
    const district = store.district || '';
    const about = store.about || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          about.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || (store.city || '').toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  return (
    <section className="stores-directory-wrap" id="magazalar">
      <div className="section-title-wrap">
        <span className="section-tag-blue">— KURUMSAL AĞ</span>
        <h2 className="section-main-heading">Doğrulanmış İşletmeler</h2>
        <p className="section-sub-desc">
          Vergi levhası ve kimlik denetimi tamamlanmış kurumsal teknoloji esnafları. Doğrudan mağazada test ve nakit ödeme imkanı.
        </p>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="stores-filter-toolbar">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Mağaza adı, ilçe veya uzmanlık ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="city-pill-filters">
          <button 
            className={`city-pill ${cityFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCityFilter('all')}
          >
            Tümü
          </button>
          <button 
            className={`city-pill ${cityFilter === 'İstanbul' ? 'active' : ''}`}
            onClick={() => setCityFilter('İstanbul')}
          >
            İstanbul
          </button>
          <button 
            className={`city-pill ${cityFilter === 'Ankara' ? 'active' : ''}`}
            onClick={() => setCityFilter('Ankara')}
          >
            Ankara
          </button>
          <button 
            className={`city-pill ${cityFilter === 'İzmir' ? 'active' : ''}`}
            onClick={() => setCityFilter('İzmir')}
          >
            İzmir
          </button>
        </div>
      </div>

      {/* Mağaza Kartları */}
      <div className="stores-cards-grid">
        {filtered.length === 0 && (
          <p className="section-sub-desc">Henüz mağaza yok.</p>
        )}
        {filtered.map(store => (
          <div key={store.id} className="store-profile-card">
            <div className="store-head-row">
              <StoreMark store={store} />
              <div className="store-head-meta">
                <div className="store-name-line">
                  <h3 className="store-title">{store.name}</h3>
                  {store.verified && <span className="verified-badge-check" title="Onaylı Kurumsal İşletme">✓</span>}
                </div>
                {store.rating != null && (
                  <div className="store-rating-line">
                    <Star size={14} className="star-fill" />
                    <span className="rating-score">{store.rating}</span>
                    <span className="rating-count">({store.reviewCount ?? 0} değerlendirme)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="store-badges-cluster">
              {(store.badges || []).map((b, i) => (
                <span key={i} className="store-tag-pill">{b}</span>
              ))}
            </div>

            <p className="store-about-text">{store.about}</p>

            <div className="store-details-list">
              <div className="detail-item">
                <MapPin size={15} />
                <span>{store.address}{store.distance ? ` (${store.distance})` : ''}</span>
              </div>
              {store.workingHours && (
                <div className="detail-item">
                  <Clock size={15} />
                  <span>Pzt-Cmt: {store.workingHours.weekday}</span>
                </div>
              )}
            </div>

            <div className="store-actions-footer">
              <button 
                className="btn-store-message"
                onClick={() => onStartChat(store)}
              >
                <MessageSquare size={16} />
                <span>Mesaj Gönder</span>
              </button>

              <button 
                className="btn-store-view"
                onClick={() => onOpenStore(store)}
              >
                <span>İncele</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StoreMark({ store }) {
  const [failed, setFailed] = useState(false);
  const src = mediaUrl(store.logo);
  if (src && !failed) {
    return (
      <div className="store-avatar-box">
        <img src={src} alt="" onError={() => setFailed(true)} />
      </div>
    );
  }
  return <div className="store-avatar-box">{store.logoText || 'AY'}</div>;
}
