import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters.'),
  content: z.string().trim().min(10, 'Content must be at least 10 characters.'),
  coverImageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  isShow: z.boolean().default(true),
});

export type BlogFormValues = z.infer<typeof blogSchema>;

