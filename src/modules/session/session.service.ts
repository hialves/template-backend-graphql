import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ILoginUser } from '../../common/interfaces/login-user.interface';
import dayjs from 'dayjs';
import ms from 'ms';
import { Request } from 'express';
import { CacheService } from '../../connections/cache/cache.service';
import { cacheKeys } from '../../common/cache/cache-keys';
import { IUserSession } from '../../common/interfaces/session.interface';
import { DeleteResult } from '../../common/graphql/types/result-type';

@Injectable()
export class SessionService {
  private readonly sessionDurationInMs: number;

  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
    private configService: ConfigService,
    private cache: CacheService,
  ) {
    this.sessionDurationInMs = ms(configService.get('SESSION_DURATION'));
  }

  async createAuthenticatedSession(user: ILoginUser, device?: string) {
    const token = await this.generateAuthToken();
    const session = new Session();
    this.repository.merge(session, {
      token,
      user,
      expiresAt: this.getExpiryDate(this.sessionDurationInMs),
      device,
      valid: true,
    });
    await this.repository.save(session);

    return token;
  }

  private getExpiryDate(timeInMs: number): string {
    return dayjs().add(timeInMs, 'milliseconds').toISOString();
  }

  private generateAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) return reject(err);
        resolve(buffer.toString('hex'));
      });
    });
  }

  getBearerToken(request: Request): string | undefined {
    const bearerToken = request.header('Authorization');

    if (bearerToken) {
      const match = bearerToken.trim().match(/^bearer\s(.+)$/i);
      if (match) {
        return match[1];
      }
    }
  }

  async getSession(token: string): Promise<IUserSession | undefined> {
    const cachedSession = await this.getCachedSession(token);
    if (cachedSession && this.validateSession(cachedSession)) {
      return cachedSession;
    }
    const session = await this.repository.findOneBy({ token });

    if (!session) return;

    const { id, expiresAt, valid, userId } = session;
    await this.setCacheSession(token, { id, token, expiresAt, valid, userId });
    return session;
  }

  async deleteSession(session: IUserSession): Promise<DeleteResult> {
    try {
      await this.repository.delete({ id: session.id });
      const key = this.getCacheKey(session.token);
      await this.cache.del(key);

      return new DeleteResult(true);
    } catch (error) {
      return new DeleteResult(false);
    }
  }

  private getCachedSession(token: string): Promise<IUserSession | undefined> {
    const key = this.getCacheKey(token);
    return this.cache.get(key);
  }

  private validateSession(session: IUserSession) {
    if (dayjs().isAfter(session.expiresAt)) return false;
    return session.token && session.valid;
  }

  private setCacheSession(token: string, session: IUserSession) {
    const key = this.getCacheKey(token);
    return this.cache.set(key, session);
  }

  private getCacheKey(token: string) {
    return cacheKeys.auth.session(token);
  }
}
