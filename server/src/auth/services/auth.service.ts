import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from '../http/dtos/user.dto';
import { UserService } from 'src/users/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: UserDto) {
    const { email, password } = dto;
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    const createdUser = await this.userService.createOne({
      ...dto,
      password: hashedPassword,
    });
    createdUser.password = undefined;

    return createdUser;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getJwtToken(userId: number) {
    const payload = { userId };
    return this.jwtService.sign(payload);
    // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
    //   'JWT_EXPIRATION_TIME',
    // )}`;
  }

  async getUserFromAuthenticationToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return this.userService.findOneById(payload.userId);
  }
}
