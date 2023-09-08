import { ValidationError as ClassValidatorError } from 'class-validator';
import { responseMessages } from '../../messages/response.messages';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType()
export class DefaultResult {
  public __typename = 'DefaultResult';
  @Field()
  public success: boolean;

  @Field()
  public message: string;
  constructor(success: boolean, message: string = '') {
    this.success = success;
    this.message = message;
  }
}

export class ErrorResult extends DefaultResult {
  constructor(message: string = '') {
    super(false, message);
  }
}

export const DeletionMessage = {
  success: responseMessages.delete.success,
  fail: responseMessages.delete.fail,
};

@ObjectType()
export class DeleteResult extends DefaultResult {
  @Field()
  public success: boolean;

  @Field()
  public message: string;
  constructor(success: boolean, message: string = '') {
    super(success, message);

    if (!this.message) {
      this.message = success ? DeletionMessage.success : DeletionMessage.fail;
    }
  }
}

export class SuccessResult extends DefaultResult {
  constructor(message: string) {
    super(true, message);
  }
}

export class NotFoundError {
  public readonly __typename = 'NotFoundError';

  constructor(
    public message: string,
    public resourceId: string = '',
  ) {}
}

export class ValidationKey {
  constructor(
    public key: string,
    public message: string,
  ) {}
}

export class ValidationError {
  public readonly __typename = 'ValidationError';
  public errors: Array<ValidationKey>;

  constructor(
    errors: Array<ClassValidatorError | ValidationKey>,
    public message: string = responseMessages.form.someErrors,
  ) {
    this.errors = errors.map((error) => {
      if (error instanceof ValidationKey) {
        return error;
      }

      return new ValidationKey(error.property, Object.values(error.constraints).join(', '));
    });
  }
}

export const DeleteResourceResult = createUnionType({
  name: 'DeleteResourceResult',
  types: () => [DefaultResult, SuccessResult] as const,
});

@ObjectType()
export class InvalidCredentialsError extends ErrorResult {
  constructor() {
    super(responseMessages.auth.invalidCredentials);
  }
}
