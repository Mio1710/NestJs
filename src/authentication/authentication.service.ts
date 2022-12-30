import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import * as bcryt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './entities/tokenPayload.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
  }

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcryt.hash(registrationData.password, 10);
    try {
      const createUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createUser.password = undefined;
      console.log('2', createUser);
      return createUser;
    } catch (e) {
      console.log(e);
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      // console.log(email, plainTextPassword);
      const user = await this.usersService.getByEmail(email);
      // console.log(user);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Đăng ký không thành công',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    console.log(plainTextPassword, hashedPassword);
    const isPasswordMatching = await bcryt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException('Không thành công', HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);
    const is = await bcryt.compare(pass, user.password);
    if (user && is) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
