import React from 'react';
import MessagesHub from './messages/MessagesHub';

export default function MessagesView({ onBackToHome, activeStore, device, onShowToast }) {
  return (
    <MessagesHub 
      activeStore={activeStore}
      device={device}
      onBackToHome={onBackToHome}
      onShowToast={onShowToast}
    />
  );
}
