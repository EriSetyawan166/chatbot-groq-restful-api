import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { ChatSessionResponse } from "src/model/chat-session.model";
import { ChatSession } from "@prisma/client";

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) { }
    
    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'test',
                password: await bcrypt.hash('test', 10),
                name: 'test',
                token: 'test',
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

    async getAllChatSessionOldOrdered():Promise<ChatSession[]> {
        return this.prismaService.chatSession.findMany({
            orderBy: {
                created_at: 'asc', 
            },
        })
    }

    async createChatSession() {
        await this.prismaService.chatSession.create({
            data: {
                title: 'test',
                user: {
                    connect:{username: 'test'},
                }
            }
        })
    }

    async create20ChatSession() {
        for (let i = 2; i <= 20; i++) {
            const title = `test${i}`;
    
            await this.prismaService.chatSession.create({
                data: {
                    title: title,
                    user: {
                        connect: { username: 'test' },
                    },
                },
            });

            await new Promise(resolve => setTimeout(resolve, 100));
        }
    
        console.log('20 chat sessions created with delay');
    }
    
    

    async deleteChatSession() {
        await this.prismaService.chatSession.deleteMany({})
    }
}