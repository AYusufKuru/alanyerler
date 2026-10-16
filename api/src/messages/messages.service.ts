import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, Prisma, SenderRole } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { OpenConversationDto, SendMessageDto } from './dto/message.dto';

const threadInclude = {
  store: { select: { id: true, name: true, logo: true, city: true, address: true, active: true } },
  listing: { select: { id: true, title: true, status: true, userId: true, specs: true, acceptedOfferId: true } },
  customer: { select: { id: true, name: true } },
  messages: { orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.ConversationInclude;

type Thread = Prisma.ConversationGetPayload<{ include: typeof threadInclude }>;

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async listForCustomer(user: AuthUser, filter = 'all', query = '') {
    const q = query.trim();
    const rows = await this.prisma.conversation.findMany({
      where: {
        customerId: user.id,
        ...(q ? { store: { name: { contains: q, mode: 'insensitive' } } } : {}),
        ...(filter === 'favorites' ? { favorites: { some: { userId: user.id } } } : {}),
      },
      include: this.listInclude(user.id),
      orderBy: { createdAt: 'desc' },
    });
    const listed = await this.toList(rows, SenderRole.admin, user.id);
    if (filter === 'offers') return listed.filter((row) => row.offerPrice != null);
    return listed;
  }

  async listForAdmin(query = '') {
    const q = query.trim();
    const rows = await this.prisma.conversation.findMany({
      where: q ? { store: { name: { contains: q, mode: 'insensitive' } } } : {},
      include: this.listInclude(),
      orderBy: { createdAt: 'desc' },
    });
    return this.toList(rows, SenderRole.customer);
  }

  async open(user: AuthUser, dto: OpenConversationDto) {
    const listing = await this.prisma.listing.findFirst({
      where: { id: dto.listingId, userId: user.id },
    });
    if (!listing) throw new NotFoundException('İlan bulunamadı.');
    const offer = await this.prisma.offer.findUnique({
      where: { listingId_storeId: { listingId: dto.listingId, storeId: dto.storeId } },
    });
    if (!offer) throw new BadRequestException('Bu mağazanın bu ilana teklifi yok.');
    const conversation = await this.prisma.conversation.upsert({
      where: {
        listingId_storeId_customerId: {
          listingId: dto.listingId,
          storeId: dto.storeId,
          customerId: user.id,
        },
      },
      create: {
        listingId: dto.listingId,
        storeId: dto.storeId,
        customerId: user.id,
      },
      update: {},
    });
    return this.thread(conversation.id, user, 'customer');
  }

  threadForCustomer(user: AuthUser, id: string) {
    return this.thread(id, user, 'customer');
  }

  threadForAdmin(user: AuthUser, id: string) {
    return this.thread(id, user, 'admin');
  }

  async sendAsCustomer(user: AuthUser, id: string, dto: SendMessageDto) {
    const conversation = await this.requireThread(id);
    if (conversation.customerId !== user.id) throw new NotFoundException('Konuşma bulunamadı.');
    await this.write(conversation, user.id, SenderRole.customer, dto.body);
    return this.thread(id, user, 'customer');
  }

  async sendAsAdmin(user: AuthUser, id: string, dto: SendMessageDto) {
    const conversation = await this.requireThread(id);
    const message = await this.write(conversation, user.id, SenderRole.admin, dto.body);
    await this.audit.log(user.id, 'message.send', 'message', message.id, {
      conversationId: conversation.id,
      storeId: conversation.storeId,
      listingId: conversation.listingId,
    });
    return this.thread(id, user, 'admin');
  }

  async setFavorite(user: AuthUser, id: string, favorite: boolean) {
    const conversation = await this.requireThread(id);
    if (conversation.customerId !== user.id) throw new NotFoundException('Konuşma bulunamadı.');
    if (favorite) {
      await this.prisma.favorite.upsert({
        where: { userId_conversationId: { userId: user.id, conversationId: id } },
        create: { userId: user.id, conversationId: id },
        update: {},
      });
    } else {
      await this.prisma.favorite.deleteMany({
        where: { userId: user.id, conversationId: id },
      });
    }
    return this.thread(id, user, 'customer');
  }

  private async write(
    conversation: { id: string; listing: { status: ListingStatus } },
    senderId: string,
    senderRole: SenderRole,
    body: string,
  ) {
    if (conversation.listing.status === ListingStatus.kapatildi) {
      throw new BadRequestException('Kapalı ilana mesaj gönderilmez.');
    }
    const text = body.trim();
    if (!text) throw new BadRequestException('Mesaj yazın.');
    return this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        senderRole,
        body: text,
      },
    });
  }

  private async thread(id: string, actor: AuthUser, reader: 'customer' | 'admin') {
    const conversation = await this.requireThread(id);
    if (reader === 'customer' && conversation.customerId !== actor.id) {
      throw new NotFoundException('Konuşma bulunamadı.');
    }
    await this.prisma.message.updateMany({
      where: {
        conversationId: id,
        senderRole: reader === 'customer' ? SenderRole.admin : SenderRole.customer,
        readAt: null,
      },
      data: { readAt: new Date() },
    });
    const [favorite, offer] = await Promise.all([
      reader === 'customer'
        ? this.prisma.favorite.findUnique({
            where: { userId_conversationId: { userId: actor.id, conversationId: id } },
          })
        : Promise.resolve(null),
      this.prisma.offer.findUnique({
        where: {
          listingId_storeId: {
            listingId: conversation.listingId,
            storeId: conversation.storeId,
          },
        },
        select: { id: true, price: true },
      }),
    ]);
    const fresh = await this.requireThread(id);
    return this.toThread(fresh, reader, Boolean(favorite), offer);
  }

  private async requireThread(id: string) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id ?? '')) {
      throw new BadRequestException('Konuşma seçin.');
    }
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: threadInclude,
    });
    if (!conversation) throw new NotFoundException('Konuşma bulunamadı.');
    return conversation;
  }

  private listInclude(userId?: string) {
    return {
      store: { select: { id: true, name: true, logo: true } },
      listing: { select: { id: true, title: true, status: true } },
      customer: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: 'desc' as const }, take: 1 },
      favorites: userId ? { where: { userId }, select: { userId: true } } : { select: { userId: true }, take: 0 },
    } satisfies Prisma.ConversationInclude;
  }

  private async toList(
    rows: Array<
      Prisma.ConversationGetPayload<{
        include: {
          store: { select: { id: true; name: true; logo: true } };
          listing: { select: { id: true; title: true; status: true } };
          customer: { select: { id: true; name: true } };
          messages: true;
          favorites: { select: { userId: true } };
        };
      }>
    >,
    unreadFrom: SenderRole,
    favoriteUserId?: string,
  ) {
    if (rows.length === 0) return [];
    const ids = rows.map((row) => row.id);
    const unread = ids.length
      ? await this.prisma.message.groupBy({
          by: ['conversationId'],
          where: { conversationId: { in: ids }, senderRole: unreadFrom, readAt: null },
          _count: { _all: true },
        })
      : [];
    const unreadMap = new Map(unread.map((row) => [row.conversationId, row._count._all]));
    const offers = await this.prisma.offer.findMany({
      where: {
        OR: rows.map((row) => ({ listingId: row.listingId, storeId: row.storeId })),
      },
      select: { listingId: true, storeId: true, price: true },
    });
    const offerMap = new Map(
      offers.map((offer) => [`${offer.listingId}:${offer.storeId}`, Number(offer.price)]),
    );
    return rows
      .map((row) => {
        const last = row.messages[0];
        return {
          id: row.id,
          store: row.store,
          listing: row.listing,
          customer: row.customer,
          lastMessage: last ? { body: last.body, createdAt: last.createdAt, fromStore: last.senderRole === SenderRole.admin } : null,
          unreadCount: unreadMap.get(row.id) ?? 0,
          favorite: favoriteUserId ? row.favorites.some((item) => item.userId === favoriteUserId) : false,
          offerPrice: offerMap.get(`${row.listingId}:${row.storeId}`) ?? null,
          updatedAt: last?.createdAt ?? row.createdAt,
        };
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  private toThread(
    conversation: Thread,
    reader: 'customer' | 'admin',
    favorite: boolean,
    offer: { id: string; price: Prisma.Decimal } | null,
  ) {
    return {
      id: conversation.id,
      store: {
        id: conversation.store.id,
        name: conversation.store.name,
        logo: conversation.store.logo,
        city: conversation.store.city,
        address: conversation.store.address,
        verified: conversation.store.active,
      },
      listing: {
        id: conversation.listing.id,
        title: conversation.listing.title,
        status: conversation.listing.status,
        storage: storageLabel(conversation.listing.specs),
      },
      customer: conversation.customer,
      favorite,
      offerId: offer?.id ?? null,
      offerPrice: offer ? Number(offer.price) : null,
      offerAccepted: Boolean(offer && conversation.listing.acceptedOfferId === offer.id),
      canSend: conversation.listing.status !== ListingStatus.kapatildi,
      messages: conversation.messages.map((message) => ({
        id: message.id,
        body: message.body,
        createdAt: message.createdAt,
        fromStore: message.senderRole === SenderRole.admin,
        mine:
          reader === 'customer'
            ? message.senderRole === SenderRole.customer
            : message.senderRole === SenderRole.admin,
      })),
    };
  }
}

function storageLabel(specs: Prisma.JsonValue) {
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) return '';
  const record = specs as Record<string, unknown>;
  const raw = record.depolama ?? record.storage;
  if (raw === 'Diğer') {
    const typed = record.depolamaDiger ?? record.storageDiger;
    return typeof typed === 'string' ? typed : '';
  }
  return typeof raw === 'string' ? raw : '';
}
