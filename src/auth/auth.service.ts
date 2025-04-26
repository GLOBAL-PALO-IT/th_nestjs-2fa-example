import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import * as speakeasy from 'speakeasy'
import { UsersService } from 'src/users/users.service'
import { LoginDTO } from './dto/login.dto'
import { PayloadType } from './types'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login(loginDto: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.userService.findOneByEmail(loginDto.email)
    const passwordMatched = await bcrypt.compare(
      loginDto.password,
      user.password,
    )
    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid credentials')
    }

    delete user.password
    const payload: PayloadType = { email: user.email, userId: user.id }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  async enable2FA(userId: number): Promise<{ secret: string }> {
    // Find the user by id
    const user = await this.userService.findOneById(userId)

    // Check if 2FA is already enabled
    if (user.enable2FA) {
      return { secret: user.twoFASecret }
    }
    // generate a secret key
    const secret = speakeasy.generateSecret().base32
    // update the user record with the secret key
    await this.userService.updateSecretKey(user.id, secret)
    return { secret }
  }

  async disable2FA(userId: number): Promise<{ message: string }> {
    // Find the user by id
    const user = await this.userService.findOneById(userId)
    // Check if 2FA is already disabled
    if (!user.enable2FA) {
      return { message: '2FA is already disabled' }
    }
    await this.userService.disable2FA(userId)
    return { message: '2FA disabled successfully' }
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findOneById(userId)
      // verify the secret with token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      })

      if (!verified) {
        return { verified: false }
      }
      return { verified: true }
    } catch (error) {
      console.debug(error)
      throw new UnauthorizedException('Error verifying token')
    }
  }
}
