import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) { }
    
    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'test',
                password: 'test',
                name: 'test',
            }
        })
    }

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test',
            },
        });
    };
}