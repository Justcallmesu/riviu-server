import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

// DTO
import { User } from '@/modules/public/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtGuardDto } from '../model/jwt-model';

// Schema

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.signedCookies.token) {
      throw new UnauthorizedException(
        'Session Expired',
        'Session Expired! Please Log In!',
      );
    }
    try {
      const data: JwtGuardDto = (await verify(
        request.signedCookies.token,
        process.env.JWT_REFRESH_SECRET as string,
      )) as JwtGuardDto;

      const userData: User | null = await this.userRepository.findOne({
        where: {
          id: +data.id,
        },
      });

      if (!userData) {
        throw new UnauthorizedException(
          'Session Expired',
          'Session Expired! Please Log In!',
        );
      }

      request.user = userData;

      return true;
    } catch (error) {
      console.error(error);

      throw new UnauthorizedException(
        'Session Expired',
        'Session Expired! Refresh Please Log In!',
      );
    }
  }
}
