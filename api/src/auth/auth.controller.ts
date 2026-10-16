import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { DeleteAccountDto, UpdateAccountDto } from './dto/account.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthUser } from './auth.types';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly account: AccountService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.auth.changePassword(user, dto);
  }

  @Get('account')
  @UseGuards(JwtAuthGuard)
  profile(@CurrentUser() user: AuthUser) {
    return this.account.profile(user);
  }

  @Patch('account')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateAccountDto) {
    return this.account.update(user, dto);
  }

  @Get('account/sales')
  @UseGuards(JwtAuthGuard)
  sales(@CurrentUser() user: AuthUser) {
    return this.account.sales(user);
  }

  @Get('account/pages/:key')
  page(@Param('key') key: string) {
    return this.account.page(key);
  }

  @Delete('account')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: AuthUser, @Body() dto: DeleteAccountDto) {
    return this.account.remove(user, dto);
  }
}
