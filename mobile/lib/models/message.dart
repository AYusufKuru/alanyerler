class ConversationSummary {
  const ConversationSummary({
    required this.id,
    required this.storeName,
    required this.listingTitle,
    required this.unreadCount,
    required this.favorite,
    this.storeLogo,
    this.lastBody,
    this.lastAt,
    this.offerPrice,
  });

  final String id;
  final String storeName;
  final String listingTitle;
  final int unreadCount;
  final bool favorite;
  final String? storeLogo;
  final String? lastBody;
  final DateTime? lastAt;
  final double? offerPrice;

  factory ConversationSummary.fromJson(Map<String, dynamic> json) {
    final store = json['store'];
    final listing = json['listing'];
    final last = json['lastMessage'];
    return ConversationSummary(
      id: json['id'] as String? ?? '',
      storeName: store is Map ? store['name'] as String? ?? '' : '',
      storeLogo: store is Map ? store['logo'] as String? : null,
      listingTitle: listing is Map ? listing['title'] as String? ?? '' : '',
      unreadCount: json['unreadCount'] is int ? json['unreadCount'] as int : 0,
      favorite: json['favorite'] == true,
      lastBody: last is Map ? last['body'] as String? : null,
      lastAt: last is Map ? DateTime.tryParse(last['createdAt'] as String? ?? '') : null,
      offerPrice: json['offerPrice'] is num ? (json['offerPrice'] as num).toDouble() : null,
    );
  }
}

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.body,
    required this.createdAt,
    required this.mine,
    required this.fromStore,
  });

  final String id;
  final String body;
  final DateTime createdAt;
  final bool mine;
  final bool fromStore;

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] as String? ?? '',
      body: json['body'] as String? ?? '',
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
      mine: json['mine'] == true,
      fromStore: json['fromStore'] == true,
    );
  }
}

class ConversationDetail {
  const ConversationDetail({
    required this.id,
    required this.storeId,
    required this.storeName,
    required this.listingTitle,
    required this.canSend,
    required this.favorite,
    required this.messages,
    this.offerPrice,
  });

  final String id;
  final String storeId;
  final String storeName;
  final String listingTitle;
  final bool canSend;
  final bool favorite;
  final double? offerPrice;
  final List<ChatMessage> messages;

  factory ConversationDetail.fromJson(Map<String, dynamic> json) {
    final store = json['store'];
    final listing = json['listing'];
    final messages = json['messages'];
    return ConversationDetail(
      id: json['id'] as String? ?? '',
      storeId: store is Map ? store['id'] as String? ?? '' : '',
      storeName: store is Map ? store['name'] as String? ?? '' : '',
      listingTitle: listing is Map ? listing['title'] as String? ?? '' : '',
      canSend: json['canSend'] == true,
      favorite: json['favorite'] == true,
      offerPrice: json['offerPrice'] is num ? (json['offerPrice'] as num).toDouble() : null,
      messages: messages is List
          ? messages
              .whereType<Map>()
              .map((item) => ChatMessage.fromJson(Map<String, dynamic>.from(item)))
              .toList()
          : const [],
    );
  }
}

class AppNotification {
  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.createdAt,
    this.readAt,
  });

  final String id;
  final String title;
  final String body;
  final DateTime createdAt;
  final DateTime? readAt;

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      body: json['body'] as String? ?? '',
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
      readAt: json['readAt'] == null ? null : DateTime.tryParse(json['readAt'] as String? ?? ''),
    );
  }
}
