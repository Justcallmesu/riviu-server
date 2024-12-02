import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Services
import { JwtGuard } from '@/modules/common/guards/JWTGuards';
import {
  LoginDto,
  RegisterDto,
  UpdateNameDto,
  UpdatePasswordDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('/login')
  async Login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginDto,
  ) {
    return await this.AuthService.login(res, body);
  }

  @Post('/register')
  async Register(@Body() body: RegisterDto) {
    return await this.AuthService.register(body);
  }

  @Get('/logout')
  @UseGuards(JwtGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.AuthService.logout(res);
  }

  @Get('/me')
  @UseGuards(JwtGuard)
  async getMe(@Req() req: Request) {
    return await this.AuthService.getMe(req);
  }

  @Put('/updateme')
  @UseGuards(JwtGuard)
  async updateMe(@Req() req: Request, @Body() body: UpdateNameDto) {
    return await this.AuthService.updateMe(req, body);
  }

  @Patch('/update-password')
  @UseGuards(JwtGuard)
  async updatePassword(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() body: UpdatePasswordDto,
  ) {
    return await this.AuthService.updatePassword(res, req, body);
  }
}
