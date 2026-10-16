import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Heart, Info, Send } from 'lucide-react';
import { loadConversation, sendConversationMessage, setConversationFavorite } from '../../api';
import { presentThread } from '../../conversation';

export default function ChatRoom({
  token,
  thread,
  onThread,
  onBackToInbox,
  onOpenStoreProfile,
  onOpenOffer,
}) {
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const sendingRef = useRef(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages.length]);

  useEffect(() => {
    const timer = setInterval(async () => {
      if (sendingRef.current) return;
      try {
        const detail = await loadConversation(token, thread.id);
        onThread(presentThread(detail));
      } catch {
        return;
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [token, thread.id, onThread]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending || !thread.canSend) return;
    sendingRef.current = true;
    setSending(true);
    setError('');
    try {
      const detail = await sendConversationMessage(token, thread.id, text);
      onThread(presentThread(detail));
      setInputText('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Mesaj gönderilemedi.');
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const toggleFavorite = async () => {
    setError('');
    try {
      const detail = await setConversationFavorite(token, thread.id, !thread.favorite);
      onThread(presentThread(detail));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Favori kaydedilemedi.');
    }
  };

  const mapsUrl = thread.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(thread.address)}`
    : '';

  return (
    <div className="chat-room-container">
      <div className="chat-room-header">
        <div className="chat-header-identity">
          <button className="wizard-nav-icon-btn" onClick={onBackToInbox} aria-label="Geri">
            <ArrowLeft size={20} />
          </button>

          <div
            className="chat-header-clickable-profile"
            onClick={onOpenStoreProfile}
            title="İşletme profilini gör"
          >
            <div className="chat-store-avatar-box">
              {thread.logoUrl ? <img src={thread.logoUrl} alt="" /> : thread.logo}
            </div>
            <div className="chat-store-meta-group">
              <div className="chat-store-name-line">
                <h3>{thread.storeName}</h3>
                {thread.verified && <Check size={16} className="chat-verified-mark" />}
              </div>
              {thread.city && <span className="chat-status-pulse">{thread.city}</span>}
            </div>
          </div>
        </div>

        <div className="chat-header-tool-actions">
          <button
            className="chat-header-icon-btn"
            onClick={toggleFavorite}
            aria-label={thread.favorite ? 'Favoriden çıkar' : 'Favoriye ekle'}
          >
            <Heart size={18} fill={thread.favorite ? 'currentColor' : 'none'} />
          </button>
          <button
            className="chat-header-icon-btn"
            onClick={onOpenStoreProfile}
            aria-label="Profil"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      <div className="chat-pinned-device-strip">
        <div className="pinned-device-info-text">
          <strong>{thread.listingTitle}</strong>
          {thread.offerPrice != null && (
            <span>Teklif {thread.offerPrice.toLocaleString('tr-TR')} TL</span>
          )}
          {thread.offerId && (
            <button type="button" className="chat-offer-link" onClick={() => onOpenOffer(thread)}>
              Teklifi Gör
            </button>
          )}
          {thread.offerAccepted && (
            <span className="chat-offer-accepted">
              <Check size={14} />
              Teklif Kabul Edildi
            </span>
          )}
          {thread.address && (
            <span>
              <a href={mapsUrl} target="_blank" rel="noreferrer">{thread.address}</a>
            </span>
          )}
        </div>
      </div>

      <div className="chat-bubbles-scroll-area">
        {thread.messages.length === 0 && (
          <div className="inbox-empty-notice">
            <p>Henüz mesaj yok. İlk mesajı siz yazabilirsiniz.</p>
          </div>
        )}
        {thread.messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble-wrapper ${message.mine ? 'user-side' : 'store-side'}`}
          >
            <div className={`bubble-content-box ${message.mine ? 'user-bubble' : 'store-bubble'}`}>
              <p>{message.body}</p>
              <span className="bubble-time-stamp">{message.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="chat-bottom-input-bar">
        <input
          type="text"
          className="chat-message-text-input"
          placeholder={thread.canSend ? 'Mesajınızı yazın...' : 'Kapalı ilana mesaj gönderilmez'}
          value={inputText}
          maxLength={2000}
          disabled={!thread.canSend || sending}
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSend();
          }}
        />
        <button
          className="btn-chat-send-action"
          onClick={handleSend}
          disabled={!thread.canSend || sending || !inputText.trim()}
          aria-label="Gönder"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
