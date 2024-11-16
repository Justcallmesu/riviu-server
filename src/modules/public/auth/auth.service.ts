import { AccessCookiesConfig } from '@/modules/common/config/cookies-config';
import { GenerateTokenType } from '@/modules/common/enum/generate-token.enum';
import GenerateToken from '@/modules/common/function/generate-token';
import ResetToken from '@/modules/common/function/reset-token';
import { ServerResponse } from '@/modules/common/model/response-model';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import {
  LoginDto,
  RegisterDto,
  UpdateNameDto,
  UpdatePasswordDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(
    res: Response,
    loginDto: LoginDto,
  ): Promise<
    ServerResponse<{
      username: string;
      name: string;
    }>
  > {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: loginDto.username,
      },
      select: {
        name: true,
        id: true,
        username: true,
        password: true,
      },
    });

    if (!foundUser)
      throw new BadRequestException('Username atau Password salah');
    if (!(await foundUser.comparePassword(loginDto.password)))
      throw new BadRequestException('Username atau Password salah');

    const userToken = GenerateToken(GenerateTokenType.REFRESH_TOKEN, {
      id: foundUser.id,
      username: foundUser.username,
    });

    res.cookie('token', userToken, AccessCookiesConfig());

    return {
      data: {
        name: foundUser.name,
        username: foundUser.username,
      },
      message: `Selamat datang kembali ${foundUser.name}`,
    };
  }

  async logout(res: Response) {
    ResetToken(res);

    return {};
  }

  async register(body: RegisterDto): Promise<
    ServerResponse<{
      username: string;
      name: string;
    }>
  > {
    const isExist = await this.userRepository.findOne({
      where: {
        username: body.username,
      },
    });

    if (isExist) {
      throw new ConflictException('Username sudah digunakan');
    }

    if (body.password !== body.confirmPassword) {
      throw new BadRequestException(
        'Password dan konfirmasi password tidak sama',
      );
    }

    const user = await this.userRepository.create(body);

    return await this.userRepository.manager.transaction(
      async (transaction) => {
        const createdUser = await transaction.save(user);

        return {
          data: {
            name: createdUser.name,
            username: createdUser.username,
          },
          message: 'User berhasil dibuat',
        };
      },
    );
  }

  async updateMe(
    req: Request,
    body: UpdateNameDto,
  ): Promise<
    ServerResponse<{
      username: string;
      name: string;
    }>
  > {
    const { id } = req.user as User;

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const updatedUser = await this.userRepository.create({
      ...user,
      ...body,
    });

    return await this.userRepository.manager.transaction(async (manager) => {
      const updatedData = await manager.save(updatedUser);

      return {
        data: {
          name: updatedData.name,
          username: updatedData.username,
        },
        message: 'Berhasil mengubah data user',
      };
    });
  }

  async getMe(req: Request): Promise<ServerResponse<User>> {
    return {
      data: req.user as User,
      message: 'Berhasil mendapatkan data user',
    };
  }

  async updatePassword(res: Response, req: Request, body: UpdatePasswordDto) {
    const { id } = req.user as User;

    const isExist: User | null = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        password: true,
      },
    });

    if (!isExist) {
      throw new UnauthorizedException(
        'Session Expired',
        'Session Expired! Please Log In!',
      );
    }

    if (!(await isExist.comparePassword(body.oldPassword))) {
      throw new BadRequestException('Password lama tidak sesuai!');
    }

    if (body.password !== body.confirmPassword) {
      throw new BadRequestException(
        'Password baru tidak sama dengan konfirmasi!',
      );
    }

    isExist.password = body.password;

    return await this.userRepository.manager.transaction(async (manager) => {
      const updatedUser = await manager.save(isExist);

      ResetToken(res);

      return {
        data: {
          name: updatedUser.name,
          username: updatedUser.username,
        },
        message: 'Password berhasil diubah, Silahkan login kembali!',
      };
    });
  }
}
