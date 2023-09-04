import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { Roles } from '../../decorators/roles.decorator'
import { Role } from '../../enums/role.enum'
import { AdminService } from './admin.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Roles(Role.SuperAdmin)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.service.create(createAdminDto)
  }

  @Roles(Role.SuperAdmin)
  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query)
  }

  @Roles(Role.SuperAdmin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.service.findOne(+id)
  }

  @Roles(Role.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    // return this.service.update(+id, updateAdminDto)
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
