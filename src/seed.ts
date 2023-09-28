import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from './config/database';
import { User } from './modules/user/entities/user.entity';
import { Role } from './common/enums/role.enum';
import { Admin } from './modules/admin/entities/admin.entity';
import path from 'path';
import * as bcrypt from 'bcrypt';

const entities = [path.join(process.cwd(), 'src', 'modules/**/*.entity.ts')];

async function seed() {
  const dataSource = new DataSource({ ...databaseConfig, entities });
  await dataSource.initialize();

  const adminRepository = dataSource.getRepository(Admin);
  const userRepository = dataSource.getRepository(User);

  const user = await userRepository.save({
    email: process.env.SUPERADMIN_EMAIL,
    password: await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 12),
    role: Role.SuperAdmin,
  });
  await adminRepository.save({
    user,
    name: 'Superadmin',
  });
  await dataSource.destroy();
}

seed();
