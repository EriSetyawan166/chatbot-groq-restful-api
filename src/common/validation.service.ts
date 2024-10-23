import { ZodType } from 'zod';

export class ValidationService {
  validate<T>(ZodType: ZodType<T>, data: T): T {
    return ZodType.parse(data);
  }
}
