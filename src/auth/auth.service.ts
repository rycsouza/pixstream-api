import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChannelsService } from 'src/channels/channels.service';
import { WalletService } from 'src/wallet/wallet.service';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly walletService: WalletService,
    private readonly channelsService: ChannelsService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser)
      throw new BadRequestException('Usuário já cadastrado, faça login.');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newUser = await this.usersService.create({
      email: dto.email,
      password: passwordHash,
      name: dto.name,
    });

    const channel = await this.channelsService.createDefaultChannelForUser(
      newUser,
    );
    const wallet = await this.walletService.createDefaultWalletForUser(
      newUser.id,
    );

    const token = this.generateToken({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
      },
      channel: {
        id: channel.id,
        name: channel.name,
        slug: channel.slug,
        widgetToken: channel.widgetToken,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user)
      throw new UnauthorizedException(
        'Usuário não cadastrado, faça o cadastro.',
      );

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciais inválidas.');

    const token = this.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
