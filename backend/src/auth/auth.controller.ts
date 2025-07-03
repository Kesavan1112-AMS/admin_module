import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { user } = req;
    const result = await this.authService.login(user, res);
    return {
      status: 1,
      msg: 'Login successful',
      data: [result],
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout(res);
    return {
      status: 1,
      msg: 'Logged out successfully',
      data: [],
    };
  }

  @Post('register')
  async register(@Body() body) {
    const result = await this.authService.register(body);
    return {
      status: 1,
      msg: 'User registered successfully',
      data: [result],
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return { user: req.user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me')
  async me(@Request() req) {
    return {
      status: 1,
      msg: 'Session valid',
      data: [req.user],
    };
  }

  // Test endpoint to check seeded data
  @Get('test-user/:companyId')
  async testUser(@Request() req, @Body() body: any) {
    try {
      const { companyId } = req.params;
      const { username, email } = body;

      let user: any = null;
      if (username) {
        user = await this.userService.findByUsername(+companyId, username);
      } else if (email) {
        user = await this.userService.findByEmail(+companyId, email);
      }

      return {
        status: 1,
        msg: 'User lookup completed',
        data: user ? [user] : [],
        debug: {
          companyId: +companyId,
          username,
          email,
          userFound: !!user,
        },
      };
    } catch (error) {
      return {
        status: 0,
        msg: 'Error looking up user',
        data: [],
        error: error.message,
      };
    }
  }
}
