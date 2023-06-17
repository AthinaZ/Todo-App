import {
  Body,
  Controller,
  HttpCode,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  signup(@Body(ValidationPipe) authcreadentialDto: AuthCredentialDto): string {
    this.authService.signUp(authcreadentialDto);
    return 'signup success';
  }

  @Post('/signin')
  @HttpCode(200)
  signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialDto);
  }

  @Get('/user')
  @UseGuards(AuthGuard())
  async getUser(@GetUser() user: User) {
    const fetchedUser = await this.authService.getUserByName(user.name);
    return { name: fetchedUser.name };
  }
}
