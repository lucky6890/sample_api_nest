import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoAmI')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signIn')
  async signIn(@Body() body: CreateUserDto, @Session() session) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signOut')
  signOut(@Session() session) {
    session.userId = null;
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  @Get()
  getUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }
}
