import { Injectable } from "@nestjs/common";
import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GroqService {
    private readonly groqClient: any;

    constructor() {
        this.groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    async getChatCompletion(message: string): Promise<any> {
    return this.groqClient.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama3-8b-8192',
    });
  }
}