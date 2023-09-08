import { Inject, Injectable } from '@nestjs/common';
import { Cache, Milliseconds } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService implements Cache {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set(key: string, value: unknown, milliseconds?: Milliseconds) {
    return this.cacheManager.set(key, value, milliseconds);
  }

  get<T = unknown>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }

  reset() {
    return this.cacheManager.reset();
  }

  wrap<T>(
    key: string,
    fn: () => Promise<T>,
    milliseconds?: Milliseconds,
  ): Promise<T> {
    return this.cacheManager.wrap(key, fn, milliseconds);
  }

  public store = this.cacheManager.store;

  async getAndSave<T>(
    key: string,
    fn: () => Promise<T>,
    milliseconds?: Milliseconds,
  ): Promise<T> {
    const exists = await this.get<T>(key);
    if (exists) return exists;

    const result = await fn();
    await this.set(key, result, milliseconds);
    return result;
  }
}
