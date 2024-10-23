import { z, ZodType } from 'zod';
export class chatValidation {
    static readonly CREATE: ZodType = z.object({
        session_id: z.number().min(1).positive(),
        message: z.string().min(1).max(1000),
    })
}