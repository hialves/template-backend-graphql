export class MockTwilioService {
  customer = {
    messages: {
      create: jest.fn(),
    },
  };
}
