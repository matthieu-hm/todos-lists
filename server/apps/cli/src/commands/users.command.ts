import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { UserNotFoundException, UsersService } from '@app/orm';

interface UserCommandOptions {
  email?: string;
}

@Command({
  name: 'users',
  arguments: '<id>',
  description: 'Find a user by id or email.',
})
export class UsersCommand extends CommandRunner {
  private logger = new Logger(UsersCommand.name);

  constructor(private readonly usersService: UsersService) {
    super();
  }

  async run(
    inputs: string[],
    options?: UserCommandOptions,
  ): Promise<void> {
    this.logger.verbose(`run(${inputs[0]})`);
    this.logger.verbose(inputs);
    this.logger.verbose(options);

    if (options?.email !== undefined && options?.email !== null) {
      return this.getUserByEmail(inputs[0]);
    }

    return this.getUserById(inputs[0]);
  }

  @Option({
    flags: '-e, --email',
    description: 'A basic number parser',
  })
  parseEmail(value: string): string {
    this.logger.verbose(`parseEmail(${value})`);
    return value;
  }

  async getUserByEmail(email: string): Promise<void> {
    this.logger.verbose(`getUserByEmail(${email})`);

    try {
      const user = await this.usersService.findOneByEmail(email, true);
      this.logger.log(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        this.logger.error(`User not found: ${email}`);
        return;
      }
      throw error;
    }
  }

  async getUserById(id: string): Promise<void> {
    this.logger.verbose(`getUserById(${id})`);

    try {
      const user = await this.usersService.findOneById(id, true);
      this.logger.log(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        this.logger.error(`User not found: ${id}`);
        return;
      }
      throw error;
    }
  }
}
