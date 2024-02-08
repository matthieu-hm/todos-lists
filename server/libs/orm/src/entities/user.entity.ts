import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
import { OAuthProviders } from '@app/shared';
import { CommonBaseEntity } from './core';
import { AuthToken } from './auth-token.entity';

@Entity('users')
@Index(['oAuthProvider', 'oAuthId'], { unique: true })
@Index(['oAuthProvider', 'email'])
export class User extends CommonBaseEntity {
  // Properties
  // ----------

  @Column({ type: 'varchar' })
  oAuthProvider: OAuthProviders;

  @Column()
  oAuthId: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  preferredUsername?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  // Relations
  // ----------

  @OneToMany(
    () => AuthToken,
    (authToken) => authToken.user,
  )
  authTokens?: AuthToken[];
}
