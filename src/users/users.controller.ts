import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CreateUserDTO } from './dto/create-user.dto'
import { User } from './user.entity'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDTO): Promise<User> {
    return this.usersService.create(createUserDto)
  }

  @Get(':email')
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email)
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: number): Promise<User> {
    return this.usersService.findOneById(id)
  }
}
