import { mediaUrl } from './api';

export function initials(name) {
  return `${name || '?'}`
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
}

export function formatWhen(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function presentConversation(row) {
  const store = row.store || {};
  const last = row.lastMessage;
  return {
    id: row.id,
    storeName: store.name || 'Mağaza',
    logo: initials(store.name),
    logoUrl: mediaUrl(store.logo),
    lastMessage: last?.body || '',
    time: formatWhen(row.updatedAt || last?.createdAt),
    unreadCount: row.unreadCount || 0,
    deviceTitle: row.listing?.title || '',
    priceOffer: typeof row.offerPrice === 'number' ? row.offerPrice : null,
    isOffer: row.offerPrice != null,
    isFavorite: row.favorite === true,
  };
}

export function presentThread(detail) {
  const store = detail.store || {};
  return {
    id: detail.id,
    storeId: store.id,
    storeName: store.name || 'Mağaza',
    logo: initials(store.name),
    logoUrl: mediaUrl(store.logo),
    city: store.city || '',
    address: store.address || '',
    listingTitle: detail.listing?.title || 'İlan',
    favorite: detail.favorite === true,
    offerPrice: typeof detail.offerPrice === 'number' ? detail.offerPrice : null,
    canSend: detail.canSend !== false,
    messages: (detail.messages || []).map((message) => ({
      id: message.id,
      body: message.body,
      time: formatWhen(message.createdAt),
      mine: message.mine === true,
    })),
  };
}
