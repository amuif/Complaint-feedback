import z from 'zod';

export const feedbackSchema = z.object({
  full_name: z.string().nonempty('Name is required'),
  phone_number: z.string().min(10, 'Phone number should be 10 digits'),
  feedback_type: z.enum(['complaint', 'compliment', 'suggestion']),
  feedback_text: z.string().min(10, 'Your text should be at least 10 characters'),
  feedback_source: z.enum(['public_feedback', 'feedback']),
  sector_id: z.string(),
});

export const feedbackStatus = z.object({
  phone_number: z.string().min(10, 'Phone number should be 10 digits'),
});
