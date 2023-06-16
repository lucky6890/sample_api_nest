import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handles signup request: ', () => {
    const user = {
      email: 'test@test.com',
      password: '123321',
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(user.email);
      });
  });

  it('Signup and then get current user: ', async () => {
    const user = {
      email: 'test@test.com',
      password: '123321',
    };
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoAmI')
      .set('Cookie', cookie)
      .expect(200);

    const { id, email } = body;

    expect(id).toBeDefined();
    expect(email).toBeDefined();
    expect(email).toEqual(user.email);
  });
});
