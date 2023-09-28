import { Injectable } from '@nestjs/common';
import { ID } from '../../@types';
import { Profile } from './unions/profile.union';
import { Role } from '../../common/enums/role.enum';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
import { CustomerService } from '../customer/customer.service';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class ProfileService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private customerService: CustomerService,
  ) {}

  async getProfile(userId: ID): Promise<typeof Profile> {
    const user = await this.userService.findOne(userId);
    if ([Role.SuperAdmin, Role.Admin, Role.Manager].includes(user.role)) {
      const admin = await this.adminService.getByUserId(userId);
      const result = new Admin();
      Object.assign(result, { ...admin, user });
      return result;
    }

    if ([Role.Customer].includes(user.role)) {
      const customer = await this.customerService.getByUserId(userId);
      const result = new Admin();
      Object.assign(result, { ...customer, user });
      return result;
    }
  }
}
