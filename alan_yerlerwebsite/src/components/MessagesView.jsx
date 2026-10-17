import React from 'react';
import MessagesHub from './messages/MessagesHub';

export default function MessagesView({ token, chatTarget, onOpenOffer, onGoOffers, onAddDevice, onHowItWorks }) {
  return (
    <MessagesHub
      token={token}
      chatTarget={chatTarget}
      onOpenOffer={onOpenOffer}
      onGoOffers={onGoOffers}
      onAddDevice={onAddDevice}
      onHowItWorks={onHowItWorks}
    />
  );
}
