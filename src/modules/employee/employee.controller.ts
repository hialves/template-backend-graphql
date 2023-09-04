import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { EmployeeService } from './employee.service'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { Public } from '../../decorators/public.decorator'
import { Role } from '../../enums/role.enum'
import { Roles } from '../../decorators/roles.decorator'

@Controller('employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Public()
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.service.create(createEmployeeDto)
  }

  @Roles(Role.SuperAdmin)
  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query)
  }

  @Roles(Role.SuperAdmin, Role.Manager, Role.Employee, Role.NoRole, Role.Client)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Roles(Role.Employee, Role.EmployeeNoLink)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    // return this.service.update(+id, updateEmployeeDto)
  }

  @Roles(Role.Employee, Role.EmployeeNoLink)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
