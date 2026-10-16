import React, { useEffect, useState } from 'react';
import MessagesInbox from './MessagesInbox';
import ChatRoom from './ChatRoom';
import StoreProfileView from './StoreProfileView';
import { loadConversation, openConversation } from '../../api';
import { presentThread } from '../../conversation';

export default function MessagesHub({
  token,
  chatTarget = null,
  onBackToHome,
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

  return (
    <div className="messages-hub-wrapper">
      {subView === 'inbox' && (
        <MessagesInbox
          token={token}
          notice={openError}
          loadingOpen={opening}
          onSelectConversation={openExisting}
          onBackToHome={onBackToHome}
        />
      )}

      {subView === 'chat' && thread && (
        <ChatRoom
          token={token}
          thread={thread}
          onThread={setThread}
          onBackToInbox={() => setSubView('inbox')}
          onOpenStoreProfile={() => setSubView('profile')}
        />
      )}

      {subView === 'profile' && thread && (
        <StoreProfileView
          store={thread}
          onBackToChat={() => setSubView('chat')}
        />
      )}
    </div>
  );
}
