import { z, ZodType } from 'zod';
export class ChatSessionValidation{
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(100)
    })
}