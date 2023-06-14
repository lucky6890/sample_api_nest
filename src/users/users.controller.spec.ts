import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find(email: string): Promise<User[]> {
        const filteredUser = users.filter((item) => item.email === email);
        return Promise.resolve(filteredUser);
      },
      findOne(id: number): Promise<User | null> {
        const filteredUser = users.filter((item) => item.id === id);
        return Promise.resolve(filteredUser[0]);
      },
      async remove(id: number): Promise<User> {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      async update(id: number, attrs: Partial<User>): Promise<User> {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
    };

    fakeAuthService = {
      async signin(email: string, password: string): Promise<User> {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
      async signup(email: string, password: string): Promise<User> {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
