import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ChatSessionController', () => {
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

    describe('POST /api/chat-sessions', () => {
        beforeEach(async () => {
            await testService.deleteUser();
            await testService.deleteChatSession();
            await testService.createUser();
            await testService.createChatSession();
        })
    
        it('Should be rejected if request is invalid', async () => {
          const response = await request(app.getHttpServer())
            .post('/api/chat-sessions')
            .set('Authorization', 'test')
            .send({
              title: '',
            })

          expect(response.status).toBe(400);
          expect(response.body.errors).toBeDefined();
        })

        it('Should be rejected if token is invalid', async () => {
            const response = await request(app.getHttpServer())
              .post('/api/chat-sessions')
              .set('Authorization', 'wrong')
              .send({
                title: 'test',
              })
  
            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
          })
    
        it('Should be able to create chat session', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/chat-sessions')
                .set('Authorization', 'test')
                .send({
                    title: 'test',
                })
  
            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe('test');
            expect(response.body.data.is_active).toBe(true);
            expect(response.body.data.created_at).toBeDefined();

            const createdSessionId = response.body.data.id;
            const allChatSessions = await testService.getAllChatSessionOldOrdered();
            const olderChatSessions = allChatSessions.slice(0, -1); 
            olderChatSessions.forEach(session => {
                if (session.id !== createdSessionId) {
                    expect(session.is_active).toBe(false);
                }
            })
        })
    })
  
    describe('GET /api/chat-sessions', () => {
      beforeEach(async () => {
          await testService.deleteUser();
          await testService.deleteChatSession();
          await testService.createUser();
          await testService.createChatSession();
      })
  
      it('Should be rejected if request is invalid', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/chat-sessions')
          .set('Authorization', 'test')
          .query({
            offset: "0",
            limit: "10",
          })
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
      })

      it('Should be rejected if token is invalid', async () => {
          const response = await request(app.getHttpServer())
            .post('/api/chat-sessions')
            .set('Authorization', 'wrong')
            .query({
              offset: 0,
              limit: 10,
            })

          expect(response.status).toBe(401);
          expect(response.body.errors).toBeDefined();
        })
  
      it('Should be able to get list chat session first page', async () => {
          await testService.create20ChatSession();
          const response = await request(app.getHttpServer())
              .get('/api/chat-sessions')
              .set('Authorization', 'test')
              .query({
                offset: 0,
                limit: 10,
              })

          expect(response.status).toBe(200);
          expect(response.body.data.length).toBe(10);
          expect(response.body.data[response.body.data.length - 1].title).toBe('test10');
      })

      it('Should be able to get list chat session second page', async () => {
        await testService.create20ChatSession();
        const response = await request(app.getHttpServer())
            .get('/api/chat-sessions')
            .set('Authorization', 'test')
            .query({
              offset: 10,
              limit: 10,
            })
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(10);
        expect(response.body.data[response.body.data.length - 1].title).toBe('test20');
    })
    })
  
    describe('PUT /api/chat-sessions/:chatSessionId', () => {
      beforeEach(async () => {
          await testService.deleteUser();
          await testService.deleteChatSession();
          await testService.createUser();
          await testService.createChatSession();
      })
  
      it('Should be rejected if request is invalid', async () => {
        const chatSession = await testService.getFirstChatSession();
        const response = await request(app.getHttpServer())
          .put(`/api/chat-sessions/${chatSession.id}`)
          .set('Authorization', 'test')
          .send({
            title: '',
          })

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
      })

      it('Should be rejected if token is invalid', async () => {
          const chatSession = await testService.getFirstChatSession();
          const response = await request(app.getHttpServer())
            .put(`/api/chat-sessions/${chatSession.id}`)
            .set('Authorization', 'wrong')
            .send({
              title: 'berubah',
            })

          expect(response.status).toBe(401);
          expect(response.body.errors).toBeDefined();
        })
  
      it('Should be able to update chat session', async () => {
          const chatSession = await testService.getFirstChatSession();
          const response = await request(app.getHttpServer())
              .put(`/api/chat-sessions/${chatSession.id}`)
              .set('Authorization', 'test')
              .send({
                  title: 'updated',
              })

          expect(response.status).toBe(200);
          expect(response.body.data.title).toBe('updated');
      })
  })
});