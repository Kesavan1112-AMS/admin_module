import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../core/services/prisma.service';
import { UserSessionService } from '../user-session/user-session.service'; // Added

interface JwtPayload {
  username: string;
  sub: number; // Typically userId
  companyId: number;
  jti?: string; // JWT ID
  // other fields...
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userSessionService: UserSessionService, // Injected
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false, // JWT expiration is handled by Passport
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    // 1. Check if session is active in DB (using JTI)
    if (!payload.jti) {
      throw new UnauthorizedException('Token is missing JTI.');
    }
    const sessionActive = await this.userSessionService.findActiveSessionByToken(payload.jti);
    if (!sessionActive) {
      throw new UnauthorizedException('Session is invalid or has been terminated.');
    }

    // 2. Verify user still exists and is active (as before)
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
        companyId: payload.companyId,
        status: 'A',
      },
      include: {
        userCategory: true,
        company: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive.');
    }

    // Attach necessary info to req.user
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      companyId: user.companyId,
      userCategoryId: user.userCategoryId,
      userCategory: user.userCategory, // Full category object
      company: user.company, // Full company object
      jti: payload.jti, // Pass along JTI for potential use (e.g. targeted logout)
    };
  }
}
