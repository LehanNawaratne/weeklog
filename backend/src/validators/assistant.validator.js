import { z } from 'zod';

export const chatBodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant'], { error: 'Role must be user or assistant' }),
        content: z
          .string()
          .trim()
          .min(1, 'Message cannot be empty')
          .max(2000, 'Message cannot be more than 2000 characters')
      })
    )
    .min(1, 'Send at least one message')
    .max(20, 'Send at most 20 messages')
});
