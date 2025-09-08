import z from 'zod';

export const ratingSchema = z.object({
  full_name: z.string().nonempty('Name is required'),
  subcity_id: z.string().nonempty('Please select a subcity'),
  sectorLeader: z.string().nonempty('Sector leader name is required'),
  director: z.string().optional(),
  teamLeader: z.string().optional(),
  experstise: z.string().optional(),
  overAllRating: z.number().min(1).max(5, 'rating should be betweeen 1 to 5'),
  courtesy: z.number().min(1).max(5, 'rating should be betweeen 1 to 5'),
  punctuality: z.number().min(1).max(5, 'rating should be betweeen 1 to 5'),
  knowledge: z.number().min(1).max(5, 'rating should be betweeen 1 to 5'),
  comment: z.string().optional(),
});
