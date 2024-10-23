import { z, ZodType } from 'zod';
export class ChatSessionValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(100),
  });

  static readonly LIST: ZodType = z.object({
    offset: z.number(),
    limit: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().min(1).positive(),
    title: z.string().min(1).max(100),
  });
}
