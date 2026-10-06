import 'dotenv/config';
import {z} from 'zod';
// Fails fast at startup if configuration is missing or weak
export const env=z.object({
 DATABASE_URL:z.string().min(1),JWT_SECRET:z.string().min(32,'JWT_SECRET must be 32+ chars'),
 JWT_EXPIRES_IN:z.string().default('8h'),PORT:z.coerce.number().default(4000),
 CLIENT_ORIGIN:z.string().default('http://localhost:5173')}).parse(process.env);
