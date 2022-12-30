import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './entities/requestWithUser.entity';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  // @HttpCode(200)
  // @UseGuards(LocalAuthenticationGuard)
  // @Post('log-in')
  // async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
  //   const { user } = request;
  //   const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
  //   response.setHeader('Set-Cookie', cookie);
  //   user.password = undefined;
  //   return response.send(user);
  // }
}
