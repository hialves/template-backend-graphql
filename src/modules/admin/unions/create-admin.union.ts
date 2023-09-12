import { createUnionType } from '@nestjs/graphql';
import { ValidationError } from '../../../common/graphql/types/result-type';
import { Admin } from '../entities/admin.entity';

export const CreateAdminResult = createUnionType({
  name: 'CreateAdminResult',
  types: () => [Admin, ValidationError] as const,
});
