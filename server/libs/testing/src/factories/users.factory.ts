import { times } from 'lodash';
import { fakerFR as faker } from '@faker-js/faker';
import { User } from '@app/orm';

interface UsersFactoryOptions {
  isDeleted?: boolean;
}

export class UsersFactory {
  generateOne(options: UsersFactoryOptions = {}): User {
    const isDeleted = !!options.isDeleted;

    return {
      id: faker.string.uuid(),
      oAuthProvider: faker.string.uuid() as any, // TODO:
      oAuthId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      preferredUsername: faker.datatype.boolean() ? faker.internet.userName() : null,
      email: faker.datatype.boolean() ? faker.internet.email() : null,
      createdAt: faker.date.past({ years: 1, refDate: '2019-01-01' }),
      updatedAt: faker.date.recent(),
      deletedAt: isDeleted ? faker.date.recent() : null,
    };
  }

  generate(count: number, options: UsersFactoryOptions = {}): User[] {
    const opt = {
      ...options,
    };

    return times(count, () => this.generateOne(opt));
  }
}
