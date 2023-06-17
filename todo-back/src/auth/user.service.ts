import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password, name } = authCredentialDto;

    const salt = await bcrypt.genSalt();

    const user = new User();
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.name = name;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async validateUserPassword(
    authCredentialDto: AuthCredentialDto,
  ): Promise<string> {
    const { username, password } = authCredentialDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await this.validatePassword(password, user.password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const hash = await bcrypt.compare(password, userPassword);
    return hash;
  }

  async getUserByName(name: string): Promise<User> {
    return this.userRepository.findOne({ where: { name } });
  }
}
