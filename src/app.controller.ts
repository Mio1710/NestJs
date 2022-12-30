import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication/authentication.service';
import { LocalAuthenticationGuard } from './authentication/localAuthentication.guard';
import { JwtAuthencationGuard } from './authentication/jwt-authencation.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authenticationService.login(req.user);
  }

  @UseGuards(JwtAuthencationGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
