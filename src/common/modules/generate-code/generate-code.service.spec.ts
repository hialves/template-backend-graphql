import { Test, TestingModule } from '@nestjs/testing';
import { GenerateCodeService } from './generate-code.service';
import { CacheService } from '../../../connections/cache/cache.service';
import { faker } from '@faker-js/faker';
import { MockCacheService } from '../../mocks/cache.mock';

describe('GenerateCodeService', () => {
  let service: GenerateCodeService;
  let cache: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateCodeService,
        {
          provide: CacheService,
          useClass: MockCacheService,
        },
      ],
    }).compile();

    service = module.get<GenerateCodeService>(GenerateCodeService);
    cache = module.get(CacheService);
  });

  describe('randomCode', () => {
    it('should return a string with length 6', async () => {
      const length = 6;
      const code = service.randomCode(length);

      expect(code.length).toEqual(length);
    });
  });

  describe('uniqueCode', () => {
    it('should call randomCode, cache.get', async () => {
      const codeSpy = jest.spyOn(service, 'randomCode');
      const cacheGetSpy = jest.spyOn(cache, 'get');
      const CODE_LENGTH = 6;
      await service.uniqueCode(CODE_LENGTH);

      expect(codeSpy).toHaveBeenCalled();
      expect(codeSpy).toHaveReturned();
      expect(cacheGetSpy).toHaveBeenCalled();
      expect(cacheGetSpy).toHaveLastReturnedWith(undefined);
    });

    it('should return a code with the specified length correctly', async () => {
      const CODE_LENGTH = 6;
      jest
        .spyOn(service, 'randomCode')
        .mockReturnValue(faker.string.numeric({ length: CODE_LENGTH }));
      jest.spyOn(cache, 'get').mockResolvedValue(undefined);
      const result = await service.uniqueCode(CODE_LENGTH);

      expect(typeof result).toBe('string');
      expect(result.length).toBe(CODE_LENGTH);
    });
  });
});
