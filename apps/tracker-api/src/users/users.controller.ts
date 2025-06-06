import { Controller, Get, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from '@/users/users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public, TokenPayload } from '@/auth/decorators';
import { MeDto, MeDtoResponse } from './dtos/me.dto';
import { mapAndValidateEntity } from '@shared/lib/map-and-validate-entity';
import { AccessTokenPayload } from '@/auth/dto/access-token.dto';
import { ACCESS_TOKEN_KEY } from '@/auth/lib';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Public()
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  async getUsers(): Promise<{ data: User[] }> {
    const data = await this.usersService.getAll();
    return { data };
  }

  @Get('me')
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @ApiOperation({
    summary: 'Получение общих данных о вошедшем в систему пользователе',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MeDtoResponse,
  })
  async me(@TokenPayload() tokenPayload: AccessTokenPayload): Promise<{ data: MeDto }> {
    const user = await this.usersService.findUser({ id: tokenPayload.uid });
    if (user == null) throw new UnauthorizedException('User is not found');
    return {
      data: mapAndValidateEntity(MeDto, {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        screenName: user.screenName,
        roles: [],
        createdAt: user.createdAt,
        isVerified: false,
      }),
    };
  }
}
