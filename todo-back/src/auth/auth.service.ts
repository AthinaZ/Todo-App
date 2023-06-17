import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserService } from './user.service';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto) {
    return this.userService.signUp(authCredentialDto);
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userService.validateUserPassword(
      authCredentialDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async getUserByName(name: string): Promise<User> {
    return this.userService.getUserByName(name);
  }
}
