import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
  ) {}

  async register(request: CreateUserRequest): Promise<UserResponse> {
    const createUserRequest: CreateUserRequest =
      this.validationService.validate(UserValidation.CREATE, request);

    const existingUser = await this.prismaService.user.count({
      where: {
        username: createUserRequest.username,
      },
    });

    if (existingUser != 0) {
      throw new HttpException('Username already taken', 400);
    }

    createUserRequest.password = await bcrypt.hash(
      createUserRequest.password,
      10,
    );

    const createResult = await this.prismaService.user.create({
      data: createUserRequest,
    });

    return {
      username: createResult.username,
      name: createResult.name,
      created_at: createResult.created_at?.toISOString(),
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginUserRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findFirst({
      where: {
        username: loginUserRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Invalid username or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid username or password', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    const updateUserRequest: UpdateUserRequest =
      this.validationService.validate(UserValidation.UPDATE, request);

    if (updateUserRequest.name) {
      user.name = updateUserRequest.name;
    }

    if (updateUserRequest.password) {
      user.password = await bcrypt.hash(updateUserRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    return {
      name: result.name,
      username: result.username,
    };
  }

  async logout(user: User): Promise<boolean> {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
      },
    });

    return true;
  }
}
