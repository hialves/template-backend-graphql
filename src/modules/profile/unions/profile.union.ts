import { createUnionType } from '@nestjs/graphql';
import { Admin } from '../../admin/entities/admin.entity';
import { Customer } from '../../customer/entities/customer.entity';

export const Profile = createUnionType({
  name: 'Profile',
  types: () => [Admin, Customer] as const,
});
