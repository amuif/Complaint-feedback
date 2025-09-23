import z from 'zod';

export const complaintSchema = z.object({
  complainantName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  subcity_id: z.string().nonempty('Please select a subcity'),
  woreda: z.string().nonempty('Woreda is required').max(20, 'Woreda cannot exceed 20 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  complaintDetails: z
    .string()
    .min(10, 'Complaint details must be at least 10 characters')
    .max(100, 'Details cannot exceed 100 characters'),
  sectorLeader: z.string().optional(),
  director: z.string().optional(),
  teamLeader: z.string().optional(),
  employee: z.string().optional(),
  office: z.string().max(20, 'Office number cannot exceed 20 characters').optional(),
  actionRequired: z
    .string()
    .min(10, 'Please explain what action you want to be taken (minimum 10 characters)')
    .max(100, 'Action request cannot exceed 100 characters'),
  complaintDate: z.string().nonempty('Please select a complaint date'),
  voice_file_path: z.string().optional(),
  attachment: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB limit
      { message: 'File size must be less than 5MB' }
    )
    .refine(
      (file) =>
        !file ||
        [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type),
      { message: 'Only images, PDFs, and Word documents are allowed' }
    ),
});

export const voiceComplaint = z.object({
  complaint_name: z.string().optional(),
  subcity_id: z.string().nonempty('Please select a subcity'),
  woreda: z.string().max(20, 'Woreda cannot exceed 20 characters').optional(),
  phone_number: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  complaintDetails: z.string().optional(),
  sectorLeader: z.string().optional().optional(),
  director: z.string().optional().optional(),
  teamLeader: z.string().optional().optional(),
  employee: z.string().optional().optional(),
  office: z.string().max(20, 'Office number cannot exceed 20 characters').optional(),
  actionRequired: z.string().optional(),
  complaintDate: z.string().optional(),
  voice_file_path: z.string(),
  complaint_source: z.string(),
  attachment: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB limit
      { message: 'File size must be less than 5MB' }
    )
    .refine(
      (file) =>
        !file ||
        [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type),
      { message: 'Only images, PDFs, and Word documents are allowed' }
    ),
});
export const trackComplaint = z.object({
  phone_number: z.string().min(10, 'Phone number should be 10 digits'),
});
