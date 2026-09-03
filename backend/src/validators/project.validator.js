import { z } from 'zod';

const name = z
  .string()
  .trim()
  .min(2, 'Project name must be at least 2 characters')
  .max(60, 'Project name must be at most 60 characters');

const description = z.string().trim().max(300, 'Description must be at most 300 characters');

export const createProjectSchema = z.object({
  name,
  description: description.optional()
});

export const updateProjectSchema = z
  .object({
    name: name.optional(),
    description: description.optional()
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    error: 'Provide a name or a description to update'
  });
