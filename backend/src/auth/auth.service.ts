import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(companyId: number, email: string, pass: string) {
    const user = await this.userService.findByEmail(companyId, email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // Exclude passwordHash from returned user
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByEmail(companyId: number, email: string, pass: string) {
    const user = await this.userService.findByEmail(companyId, email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // Exclude passwordHash from returned user
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserByUsername(
    companyId: number,
    username: string,
    pass: string,
  ) {
    const user = await this.userService.findByUsername(companyId, username);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // Exclude passwordHash from returned user
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, res: Response) {
    const payload = {
      username: user.username,
      sub: user.id,
      companyId: user.companyId,
    };
    const token = this.jwtService.sign(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: this.configService.get<string>('nodeEnv') === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Return user info directly
    return user;
  }

  logout(res: Response) {
    res.clearCookie('access_token');
  }

  async register(body: any) {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      companyId,
      userCategoryId,
    } = body;
    const passwordHash = await bcrypt.hash(password, 10);
    // You may want to add validation and error handling here
    return this.userService.createUser({
      username,
      passwordHash,
      email,
      firstName,
      lastName,
      companyId,
      userCategoryId,
      status: 'A',
    });
  }
}
