import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';

describe('ChatController', () => {
    let app: INestApplication;
    let logger: Logger;
    let testService: TestService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        logger = app.get(WINSTON_MODULE_PROVIDER);
        testService = app.get(TestService);
    });

    describe('POST /api/chat-sessions/:chatSessionId/chat', () => {
        beforeEach(async () => {
            await testService.deleteUser();
            await testService.deleteChatSession();
            await testService.createUser();
            await testService.createChatSession();
        })
    
        it('Should be rejected if request is invalid', async () => {
          const chatSession = await testService.getFirstChatSession();
          const response = await request(app.getHttpServer())
            .post(`/api/chat-sessions/${chatSession.id}/chat`)
            .set('Authorization', 'test')
            .send({
              message: '',
            })
          expect(response.status).toBe(400);
          expect(response.body.errors).toBeDefined();
        })

        it('Should be rejected if token is invalid', async () => {
            const chatSession = await testService.getFirstChatSession();
            const response = await request(app.getHttpServer())
              .post(`/api/chat-sessions/${chatSession.id}/chat`)
              .set('Authorization', 'wrong')
              .send({
                message: 'testing',
              })
  
            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
          })
    
        it('Should be able to create chat', async () => {
            const chatSession = await testService.getFirstChatSession();
            const response = await request(app.getHttpServer())
                .post(`/api/chat-sessions/${chatSession.id}/chat`)
                .set('Authorization', 'test')
                .send({
                    message: 'hello',
                })
            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBe(2);
            expect(response.body.data[0]).toEqual(
                expect.objectContaining({
                    sender: 'user',
                    message: 'hello',  
                })
            );
            expect(response.body.data[1]).toEqual(
                expect.objectContaining({
                    sender: 'ai',
                    message: expect.any(String), 
                })
            );
        })
    })
})