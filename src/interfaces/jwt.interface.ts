import { Admin } from '../app/admin/entities/admin.entity'
import { Client } from '../app/client/entities/client.entity'
import { Employee } from '../app/employee/entities/employee.entity'
import { Role } from '../enums/role.enum'

export interface ClientJwtPayload
  extends Omit<Client, 'password' | 'cardToken' | 'facebookToken' | 'googleToken' | 'phone'> {
  role: Role.Client
}

export interface EmployeeJwtPayload extends Omit<Employee, 'password' | 'restaurantEmployees'> {
  role: Role.Manager | Role.Employee | Role.EmployeeNoLink
  restaurantId?: number
}

export interface AdminJwtPayload extends Omit<Admin, 'password'> {
  role: Role.SuperAdmin | Role.Admin
}

export type JwtPayload = ClientJwtPayload | EmployeeJwtPayload | AdminJwtPayload
