import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(email: string, password: string) {
    const user = await this.usersService.find(email);
    if (user.length != 0) {
      throw new BadRequestException('Email in use already!');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = `${salt}.${hash.toString('hex')}`;

    const new_user = await this.usersService.create(email, result);

    return new_user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    const [salt, stored_hash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (stored_hash !== hash.toString('hex')) {
      throw new BadRequestException('Bad Password!');
    }

    return user;
  }
}
