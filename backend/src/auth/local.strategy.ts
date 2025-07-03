import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Use 'email' field from request
      passwordField: 'password',
      passReqToCallback: true, // Pass the entire request to validate
    });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    // Extract companyId from request body
    const { companyId } = req.body;

    if (!companyId) {
      throw new UnauthorizedException('Company ID is required');
    }

    // Since we are using the email field, we can directly validate by email
    const user = await this.authService.validateUserByEmail(
      companyId,
      email,
      password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
