import { sql } from 'drizzle-orm';
import { pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable(
  'users',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: varchar('email', { length: 320 }).notNull(),
    password: text('password').notNull(),
  },
  table => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
    };
  }
);

export const signupSchema = createInsertSchema(users).omit({ id: true });
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});
