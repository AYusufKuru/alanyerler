import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Info, MoreVertical, Paperclip, Send, CheckCheck, MapPin, Check, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ChatRoom({ 
  conversation, 
  device, 
  onBackToInbox, 
  onOpenStoreProfile, 
  onShowToast 
}) {
  const storeData = conversation || {
    storeName: "TechStore",
    logo: "TECH",
    verified: true,
    priceOffer: 42500,
    district: "Kadıköy / İstanbul"
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "store",
      text: "Merhaba, cihazınız için 42.500 TL teklifimizi iletebilirim. İsterseniz detayları konuşalım.",
      time: "14:32"
    },
    {
      id: 2,
      sender: "contract",
      price: storeData.priceOffer || 42500,
      validDays: 3,
      payment: "Nakit / Havale",
      delivery: "Mağaza / Adresinizden",
      isAccepted: false
    },
    {
      id: 3,
      sender: "user",
      text: "Merhaba, teklifiniz için teşekkür ederim. Cihazı ne zaman teslim edebilirim?",
      time: "14:35"
    },
    {
      id: 4,
      sender: "store",
      text: "Bugün veya yarın mağazamıza getirebilirsiniz. Konumumuz aşağıdadır.",
      time: "14:36"
    },
    {
      id: 5,
      sender: "location",
      storeName: `${storeData.storeName} - Kadıköy`,
      address: "Bağdat Cad. No:123, Kadıköy / İstanbul"
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [contractAccepted, setContractAccepted] = useState(false);
  const [isStoreTyping, setIsStoreTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStoreTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Mağazanın gerçekçi "yazıyor..." simülasyonu
    setIsStoreTyping(true);
    setTimeout(() => {
      setIsStoreTyping(false);
      const automatedReplies = [
        "Harika! Cihazı mağazamızda teknik ekibimizle 10 dakika içinde kontrol edip hemen ödemenizi yapabiliriz.",
        "Anlaşıldı, randevunuzu sisteme kaydettik. Gelmeden 15 dakika önce aramanız yeterlidir.",
        "Ekspertiz sırasında orijinal şarj adaptörünü de yanınızda getirmeniz faydalı olacaktır."
      ];
      const randomReply = automatedReplies[Math.floor(Math.random() * automatedReplies.length)];

      const storeReply = {
        id: Date.now() + 1,
        sender: "store",
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, storeReply]);
    }, 1800);
  };

  const handleAcceptContract = () => {
    setContractAccepted(true);
    onShowToast(`🎉 ${storeData.priceOffer?.toLocaleString('tr-TR') || '42.500'} TL Teklif Kabul Edildi! Mağazaya bildirim gönderildi.`);
  };

  const categoryImages = {
    laptop: '/assets/categories/laptop.jpg',
    phone: '/assets/categories/phone.jpg',
    console: '/assets/categories/console.jpg',
    gpu: '/assets/categories/gpu.jpg',
    tablet: '/assets/categories/tablet.jpg',
    watch: '/assets/categories/watch.jpg',
    headphones: '/assets/categories/headphones.jpg'
  };

  const deviceImgSrc = device?.photos?.[0] || categoryImages[device?.category] || categoryImages.laptop;
  const formatDeviceSpecsLine = () => {
    if (!device?.specs) return "M2 Pro • 16 GB • 512 GB SSD";
    const { cpu, gpu, ram, storage, registrationStatus, gamepads, gpuSecurity } = device.specs;
    const parts = [];
    if (cpu && !['console', 'gpu'].includes(device.category)) parts.push(cpu);
    if (gpu && gpu !== 'Dahili Grafik Çipi' && gpu !== 'Dahili Mobil Grafik İşlemci') parts.push(gpu);
    if (ram && !['console', 'gpu'].includes(device.category)) parts.push(ram);
    if (storage) parts.push(storage);
    if (registrationStatus) parts.push(registrationStatus.split('(')[0].trim());
    if (gamepads) parts.push(gamepads);
    if (gpuSecurity) parts.push(gpuSecurity);
    if (device.condition?.batteryHealth && ['laptop', 'macbook', 'phone', 'tablet', 'watch'].includes(device.category)) {
      parts.push(`Pil: ${device.condition.batteryHealth}`);
    }
    return parts.join(' • ') || `${cpu || ''} • ${ram || ''} • ${storage || ''}`;
  };

  const deviceModel = device?.specs?.model || "MacBook Pro 14\" (2023)";
  const deviceSpecs = formatDeviceSpecsLine();

  return (
    <div className="chat-room-container">
      {/* Üst Bar (Fotoğraf 1 Orta Birebir) */}
      <div className="chat-room-header">
        <div className="chat-header-identity">
          <button className="wizard-nav-icon-btn" onClick={onBackToInbox} aria-label="Geri">
            <ArrowLeft size={20} />
          </button>

          <div 
            className="chat-header-clickable-profile"
            onClick={() => onOpenStoreProfile(storeData)}
            title="İşletme Profilini Gör"
          >
            <div className="chat-store-avatar-box">
              {storeData.logo || "TECH"}
            </div>

            <div className="chat-store-meta-group">
              <div className="chat-store-name-line">
                <h3>{storeData.storeName}</h3>
                {storeData.verified && <span className="verified-badge-check">✓</span>}
              </div>
              <span className="chat-status-pulse">
                <span className="status-dot-green" />
                <span>Çevrimiçi</span>
              </span>
            </div>
          </div>
        </div>

        <div className="chat-header-tool-actions">
          <button 
            className="chat-header-icon-btn" 
            onClick={() => onShowToast(`📞 ${storeData.storeName} aranıyor: +90 (216) 450 00 00`)}
            aria-label="Ara"
          >
            <Phone size={18} />
          </button>

          <button 
            className="chat-header-icon-btn" 
            onClick={() => onOpenStoreProfile(storeData)}
            aria-label="Profil"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Sabit Cihaz Önizleme Çubuğu */}
      <div className="chat-pinned-device-strip">
        <div className="pinned-left-side">
          <img src={deviceImgSrc} alt={deviceModel} className="pinned-device-thumbnail" />
          <div className="pinned-device-info-text">
            <strong>{deviceModel}</strong>
            <span>{deviceSpecs}</span>
          </div>
        </div>

        <button 
          className="btn-pinned-device-arrow"
          onClick={() => onShowToast(`İlan: ${deviceModel} (${deviceSpecs})`)}
          aria-label="Cihaz Detayları"
        >
          ➔
        </button>
      </div>

      {/* Mesaj Akışı (Stream) */}
      <div className="chat-bubbles-scroll-area">
        {messages.map(msg => {
          // 1. Mağaza Mesajı
          if (msg.sender === 'store') {
            return (
              <div key={msg.id} className="chat-bubble-wrapper store-side">
                <div className="bubble-content-box store-bubble">
                  <p>{msg.text}</p>
                  <span className="bubble-time-stamp">{msg.time}</span>
                </div>
              </div>
            );
          }

          // 2. Kullanıcı Mesajı
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="chat-bubble-wrapper user-side">
                <div className="bubble-content-box user-bubble">
                  <p>{msg.text}</p>
                  <div className="user-bubble-footer">
                    <span className="bubble-time-stamp">{msg.time}</span>
                    <CheckCheck size={14} className="double-check-icon" />
                  </div>
                </div>
              </div>
            );
          }

          // 3. Gömülü Zengin Teklif Kartı (Fotoğraf 1 Orta Birebir)
          if (msg.sender === 'contract') {
            return (
              <div key={msg.id} className="chat-rich-contract-card">
                <div className="contract-top-row">
                  <div className="contract-price-cluster">
                    <span className="contract-tag-symbol">🏷️</span>
                    <div>
                      <span className="contract-label-dim">Teklif Fiyatı</span>
                      <h4 className="contract-price-highlight">
                        {msg.price.toLocaleString('tr-TR')} TL
                      </h4>
                    </div>
                  </div>

                  <button 
                    className={`btn-contract-action ${contractAccepted ? 'accepted' : ''}`}
                    onClick={handleAcceptContract}
                    disabled={contractAccepted}
                  >
                    {contractAccepted ? (
                      <>
                        <Check size={16} />
                        <span>Kabul Edildi</span>
                      </>
                    ) : (
                      <span>Teklifi Kabul Et ➔</span>
                    )}
                  </button>
                </div>

                <div className="contract-specs-mini-grid">
                  <div className="contract-spec-cell">
                    <span className="spec-cell-label">Geçerlilik Süresi:</span>
                    <strong className="spec-cell-value">{msg.validDays} gün</strong>
                  </div>
                  <div className="contract-spec-cell">
                    <span className="spec-cell-label">Ödeme Şekli:</span>
                    <strong className="spec-cell-value">{msg.payment}</strong>
                  </div>
                  <div className="contract-spec-cell">
                    <span className="spec-cell-label">Teslimat:</span>
                    <strong className="spec-cell-value">{msg.delivery}</strong>
                  </div>
                  <div className="contract-spec-cell full-width">
                    <span className="spec-cell-label">Ek Bilgi:</span>
                    <span className="spec-cell-note">
                      Cihaz kontrolü ve seri no doğrulaması sonrası nakit veya havale ile anında ödenir.
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // 4. Mağaza Konum Kartı (Location Bubble)
          if (msg.sender === 'location') {
            return (
              <div key={msg.id} className="chat-location-bubble-card">
                <div className="loc-card-icon-wrap">
                  <MapPin size={22} />
                </div>
                <div className="loc-card-text-block">
                  <strong>{msg.storeName}</strong>
                  <p>{msg.address}</p>
                </div>
                <button 
                  className="loc-card-direction-btn"
                  onClick={() => onShowToast('Harita yol tarifi açılıyor: Kadıköy')}
                  aria-label="Yol Tarifi"
                >
                  ➔
                </button>
              </div>
            );
          }

          return null;
        })}

        {/* Canlı "Yazıyor..." Göstergesi */}
        {isStoreTyping && (
          <div className="chat-bubble-wrapper store-side">
            <div className="bubble-content-box typing-indicator-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Alt Mesaj Giriş Barı */}
      <div className="chat-bottom-input-bar">
        <button 
          className="btn-chat-tool-btn" 
          onClick={() => onShowToast('Fotoğraf veya belge ekleme menüsü')}
          aria-label="Dosya Ekle"
        >
          <Paperclip size={19} />
        </button>

        <input 
          type="text" 
          className="chat-message-text-input"
          placeholder="Mesajınızı yazın..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <button 
          className="btn-chat-send-action" 
          onClick={handleSend}
          disabled={!inputText.trim()}
          aria-label="Gönder"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
