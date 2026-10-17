import React, { useEffect, useState } from 'react';
import { ArrowRight, FileText, MessageCircle, Plus, Shield, Tag } from 'lucide-react';
import MessagesInbox from './MessagesInbox';
import ChatRoom from './ChatRoom';
import StoreProfileView from './StoreProfileView';
import { loadConversation, openConversation } from '../../api';
import { presentThread } from '../../conversation';

export default function MessagesHub({
  token,
  chatTarget = null,
  onOpenOffer,
  onGoOffers,
  onAddDevice,
  onHowItWorks,
}) {
  const [subView, setSubView] = useState('inbox');
  const [thread, setThread] = useState(null);
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState('');

  useEffect(() => {
    if (!chatTarget?.listingId || !chatTarget?.storeId) return undefined;
    let active = true;
    setOpening(true);
    setOpenError('');
    openConversation(token, chatTarget.listingId, chatTarget.storeId)
      .then((detail) => {
        if (!active) return;
        setThread(presentThread(detail));
        setSubView('chat');
      })
      .catch((reason) => {
        if (!active) return;
        setOpenError(reason instanceof Error ? reason.message : 'Konuşma açılamadı.');
        setSubView('inbox');
      })
      .finally(() => {
        if (active) setOpening(false);
      });
    return () => {
      active = false;
    };
  }, [token, chatTarget]);

  const openExisting = async (row) => {
    setOpening(true);
    setOpenError('');
    try {
      const detail = await loadConversation(token, row.id);
      setThread(presentThread(detail));
      setSubView('chat');
    } catch (reason) {
      setOpenError(reason instanceof Error ? reason.message : 'Konuşma açılamadı.');
    } finally {
      setOpening(false);
    }
  };

  const chatOpen = subView !== 'inbox' && thread;

  return (
    <div className="msg-page">
      <header className="msg-page-head">
        <h1>Mesajlar</h1>
        <p>Mağazalarla cihazın ve teklifin hakkında konuş.</p>
      </header>

      <div className={`msg-split ${chatOpen ? 'msg-chat-open' : ''}`}>
        <MessagesInbox
          token={token}
          notice={openError}
          loadingOpen={opening}
          selectedId={thread?.id}
          onSelectConversation={openExisting}
        />
        <section className="msg-stage">
          {subView === 'chat' && thread && (
            <ChatRoom
              token={token}
              thread={thread}
              onThread={setThread}
              onBackToInbox={() => setSubView('inbox')}
              onOpenStoreProfile={() => setSubView('profile')}
              onOpenOffer={onOpenOffer}
            />
          )}
          {subView === 'profile' && thread && (
            <StoreProfileView
              store={thread}
              onBackToChat={() => setSubView('chat')}
            />
          )}
          {subView === 'inbox' && (
            <div className="msg-empty">
              <div className="msg-empty-art" aria-hidden="true">
                <MessageCircle size={34} />
                <span><Tag size={14} /></span>
              </div>
              <h2>İlk konuşman bir teklifle başlar</h2>
              <p>Cihazına gelen bir teklifi inceleyerek mağazayla iletişime geçebilirsin.</p>
              <button type="button" className="msg-primary" onClick={onGoOffers}>
                Tekliflerime Git <ArrowRight size={16} />
              </button>
              <button type="button" className="msg-text" onClick={onAddDevice}>
                <Plus size={15} /> Cihaz Ekle
              </button>
              <div className="msg-hint">
                <FileText size={15} />
                <span>Cihaz ve teklif bilgileri konuşmayla birlikte görünür.</span>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="msg-keep">
        <div>
          <Shield size={18} />
          <div>
            <strong>İletişimi uygulama içinde sürdür</strong>
            <p>Cihaz ve teklif detaylarını aynı konuşmada takip et.</p>
          </div>
        </div>
        <button type="button" onClick={onHowItWorks}>Nasıl Çalışır? <ArrowRight size={14} /></button>
      </div>
    </div>
  );
}
