import { Injectable, Req, Ip } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express'; // Added Request
import { ConfigService } from '@nestjs/config';
import { UserSessionService } from '../user-session/user-session.service'; // Added
import { v4 as uuidv4 } from 'uuid'; // For JTI

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userSessionService: UserSessionService, // Injected
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
    // The companyId for registration would typically be a specific "public registration" company
    // or determined by some other logic (e.g. invitation, subdomain).
    // For now, assuming companyId is provided in the body, which might be for a specific tenant's self-registration portal.
    return this.userService.internalCreateUser({ // Changed to internalCreateUser
      username,
      password, // Pass raw password, DTO expects it, service will handle hashing if CreateUserDto is used directly by internalCreateUser
      passwordHash, // Pass hash directly
      email,
      firstName,
      lastName,
      companyId, // Must be validated upstream or part of a specific registration flow
      userCategoryId, // Must be a default/public registration category for that company
      status: 'A',
      // createdBy/updatedBy will be self-assigned by internalCreateUser if not provided
    });
  }
}
