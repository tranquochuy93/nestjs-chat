import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('signup')
  signup(@Body() dto: UserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() request: any, @Res() response: Response) {
    const { user } = request;
    const jwtToken = this.authService.getJwtToken(user.id);
    response.cookie('Authentication', jwtToken, {
      httpOnly: false, // true: Ensures the cookie is only accessible on the server side. A cookie with the HttpOnly attribute is inaccessible to the JavaScript Document.cookie API; it's only sent to the server
      maxAge: this.configService.get('JWT_EXPIRATION_TIME'), // Cookie expiration time in milliseconds (e.g., 24 hours)
      path: '/', // Cookie path
      secure: false,
      // Additional options like domain, secure, etc. can be specified here
    });

    // response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }
}
