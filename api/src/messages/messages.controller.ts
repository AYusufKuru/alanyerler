import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OpenConversationDto, SendMessageDto } from './dto/message.dto';
import { MessagesService } from './messages.service';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query('filter') filter?: string,
    @Query('q') q?: string,
  ) {
    return this.messages.listForCustomer(user, filter, q);
  }

  @Post()
  open(@CurrentUser() user: AuthUser, @Body() dto: OpenConversationDto) {
    return this.messages.open(user, dto);
  }

  @Get(':id')
  one(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.messages.threadForCustomer(user, id);
  }

  @Post(':id/messages')
  send(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messages.sendAsCustomer(user, id, dto);
  }

  @Post(':id/favorite')
  favorite(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.messages.setFavorite(user, id, true);
  }

  @Delete(':id/favorite')
  unfavorite(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.messages.setFavorite(user, id, false);
  }
}

@Controller('admin/conversations')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminMessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.messages.listForAdmin(q);
  }

  @Get(':id')
  one(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.messages.threadForAdmin(user, id);
  }

  @Post(':id/messages')
  send(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.messages.sendAsAdmin(user, id, dto);
  }
}
