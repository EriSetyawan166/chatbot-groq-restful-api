import { HttpException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CreateUserRequest, UserResponse } from "../model/user.model";
import { ValidationService } from "../common/validation.service";
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    ) { }
    
    async register(request: CreateUserRequest):Promise<UserResponse> {
        const createUserRequest: CreateUserRequest = this.validationService.validate(UserValidation.CREATE, request);

        const existingUser = await this.prismaService.user.count({
            where: {
                username: createUserRequest.username,
            },
        });

        if (existingUser != 0) {
            throw new HttpException('Username already taken', 400);
        };

        createUserRequest.password = await bcrypt.hash(createUserRequest.password, 10);

        const createResult = await this.prismaService.user.create({
            data: createUserRequest,
        });

        return {
            username: createResult.username,
            name: createResult.name,
            created_at: createResult.created_at?.toISOString(),
        }
    };
}