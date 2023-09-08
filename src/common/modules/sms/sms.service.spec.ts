import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';
import { GenerateCodeService } from '../generate-code/generate-code.service';
import { CacheService } from '../../../connections/cache/cache.service';
import { UserService } from '../../../modules/user/user.service';
import { TwilioService } from '../../../connections/twilio/twilio.service';
import { responseMessages } from '../../messages/response.messages';
import { MockTwilioService } from '../../mocks/twilio.mock';
import { MockCacheService } from '../../mocks/cache.mock';

describe('SmsService', () => {
  let service: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: CacheService,
          useClass: MockCacheService,
        },
        GenerateCodeService,
        UserService,
        {
          provide: TwilioService,
          useClass: MockTwilioService,
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    const testCases = [
      { input: '+5511994941212', shouldReject: false },
      { input: '+551194941212', shouldReject: false },
      { input: '551194941212', shouldReject: true },
      { input: '12345678900', shouldReject: true },
      { input: '00000000000', shouldReject: true },
      { input: '+5511 (11) 9 94941212', shouldReject: true },
      { input: '+551 (19) 9 94941212', shouldReject: true },
      { input: '####', shouldReject: true },
      { input: '+55', shouldReject: true },
    ];

    const randomString = (Math.random() + 1).toString(36).substring(4);
    testCases.forEach(({ input, shouldReject }) => {
      it(`${shouldReject ? 'rejects' : 'resolves'} when input is ${input}`, async () => {
        if (shouldReject) {
          await expect(service.send(randomString, input)).rejects.toThrow(responseMessages.invalidPhone);
        } else {
          await expect(service.send(randomString, input)).resolves.not.toThrow(responseMessages.invalidPhone);
        }
      });
    });
  });
});
