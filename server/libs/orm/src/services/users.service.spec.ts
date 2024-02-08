import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { UsersFactory } from '@app/testing';
import {
  entities,
  User,
} from '../entities';
import { UsersService } from './users.service';
import {
  UserNotFoundException,
} from '../exceptions';

describe('UsersService', () => {
  let service: UsersService;
  let entityManager: EntityManager;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
      ],
      imports: [
        ConfigurationModule,
        ConfigModule,
        DatabaseModule,
        TypeOrmModule.forFeature(entities),
      ],
    }).compile();

    entityManager = module.get(EntityManager);
    service = module.get(UsersService);
    connection = module.get(Connection);
  });

  afterEach(async () => {
    connection.destroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Functions', () => {
    let usersCount: number;
    let users: User[];
    let usersDeletedCount: number;
    let usersDeleted: User[];
    let userToFind: User;
    let userDeletedToFind: User;

    beforeEach(async () => {
      const usersFactory = new UsersFactory();

      usersCount = faker.number.int({ min: 13, max: 15 });
      users = usersFactory
        .generate(usersCount)
        .map((user) => {
          // eslint-disable-next-line no-param-reassign
          delete user.id;
          return user;
        });
      usersDeletedCount = faker.number.int({ min: 10, max: 12 });
      usersDeleted = usersFactory
        .generate(usersDeletedCount, { isDeleted: true })
        .map((user) => {
          // eslint-disable-next-line no-param-reassign
          delete user.id;
          return user;
        });

      await entityManager.save(User, [...users, ...usersDeleted]);

      userToFind = faker.helpers.arrayElement(users);
      userDeletedToFind = faker.helpers.arrayElement(usersDeleted);
    });

    afterEach(async () => {
      const allUsers = [...users, ...usersDeleted];
      await entityManager.delete(User, allUsers.map((u) => u.id));
      usersCount = null;
      users = null;
      usersDeletedCount = null;
      usersDeleted = null;
      userToFind = null;
    });

    describe('findOneById()', () => {
      it('should get one user', async () => {
        const userFound = await service.findOneById(userToFind.id)
          .catch((err) => {
            expect(true).toBeFalsy();
            throw err;
          });

        expect(userFound).toBeInstanceOf(User);
        expect(userFound.id).toBe(userToFind.id);
      });

      it('should throw err if user do not exist', async () => {
        await service.findOneById('00000000-0000-0000-0000-000000000000')
          .then(() => expect(true).toBeFalsy())
          .catch((err) => expect(err).toBeInstanceOf(UserNotFoundException));

        await service.findOneById('thisIdIsNotUuid')
          .then(() => expect(true).toBeFalsy())
          .catch((err) => expect(err).toBeInstanceOf(UserNotFoundException));
      });

      it('should throw err if user deleted (withDelete false)', async () => {
        await service.findOneById(userDeletedToFind.id)
          .then(() => expect(true).toBeFalsy())
          .catch((err) => expect(err).toBeInstanceOf(UserNotFoundException));
      });

      it('should get one if user deleted (withDelete true)', async () => {
        const userFound = await service.findOneById(userDeletedToFind.id, true)
          .catch((err) => {
            expect(true).toBeFalsy();
            throw err;
          });

        expect(userFound).toBeInstanceOf(User);
        expect(userFound.id).toBe(userDeletedToFind.id);
      });
    });
  });
});
