import { z } from 'zod';

export const testimonialSchema = z.object({
  quote: z.string().trim().min(5, 'Quote must be at least 5 characters.'),
  author: z.string().trim().min(2, 'Author name must be at least 2 characters.'),
  isShow: z.boolean().default(true),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

