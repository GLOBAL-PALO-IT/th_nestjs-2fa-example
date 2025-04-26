import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { CreateUserDTO } from 'src/users/dto/create-user.dto'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'
import { LoginDTO } from './dto/login.dto'
import { ValidateTokenDTO } from './dto/validate-token.dto'
import { JwtAuthGuard } from './jwt-guard'
import { Enable2FAType } from './types'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: CreateUserDTO) {
    return this.userService.create(registerDto)
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto)
  }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Request()
    req,
  ): Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId)
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  validate2FA(
    @Request()
    req,
    @Body()
    validateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      req.user.userId,
      validateTokenDTO.token,
    )
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(
    @Request()
    req,
  ): Promise<{ message: string }> {
    return this.authService.disable2FA(req.user.userId)
  }
}
