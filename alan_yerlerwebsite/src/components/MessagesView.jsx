import React from 'react';
import MessagesHub from './messages/MessagesHub';

export default function MessagesView({ token, chatTarget, onBackToHome, onOpenOffer }) {
  return (
    <MessagesHub
      token={token}
      chatTarget={chatTarget}
      onBackToHome={onBackToHome}
      onOpenOffer={onOpenOffer}
    />
  );
}
