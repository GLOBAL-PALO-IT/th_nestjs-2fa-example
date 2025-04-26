import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { Repository, UpdateResult } from 'typeorm'
import { CreateUserDTO } from './dto/create-user.dto'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = new User()
    user.firstName = userDTO.firstName
    user.lastName = userDTO.lastName
    user.email = userDTO.email

    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(userDTO.password, salt)

    const savedUser = await this.userRepository.save(user)
    delete savedUser.password
    return savedUser
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    )
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: null,
        enable2FA: false,
      },
    )
  }
}
