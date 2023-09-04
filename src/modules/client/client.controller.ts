import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { Public } from '../../decorators/public.decorator'
import { Roles } from '../../decorators/roles.decorator'
import { Role } from '../../enums/role.enum'
import { ClientService } from './client.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@Controller('client')
export class ClientController {
  constructor(private readonly service: ClientService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateClientDto) {
    return this.service.create(dto)
  }

  @Roles(Role.SuperAdmin)
  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query)
  }

  @Roles(Role.SuperAdmin, Role.Manager, Role.Employee, Role.Client)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  // @Roles(Role.Client)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
  //   return this.service.update(+id, dto)
  // }

  @Roles(Role.Client)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
