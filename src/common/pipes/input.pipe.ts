import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class InputPipe implements PipeTransform {
  // Credits to:
  // https://stackoverflow.com/questions/53650528/validate-nested-objects-using-class-validator-in-nest-js-controller
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);

    return object;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
