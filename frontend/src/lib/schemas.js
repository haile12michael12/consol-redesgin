import { z } from 'zod'

const name = z
  .string()
  .trim()
  .min(2, { message: 'form.nameError' })
  .max(120, { message: 'form.tooLong' })

const email = z
  .string()
  .trim()
  .min(1, { message: 'form.emailError' })
  .email({ message: 'form.emailError' })
  .max(180, { message: 'form.tooLong' })

const phone = z
  .string()
  .trim()
  .min(7, { message: 'form.phoneError' })
  .max(30, { message: 'form.tooLong' })
  .regex(/^[+()\d\s-]+$/, { message: 'form.phoneError' })

const subject = z.string().trim().min(3, { message: 'form.subjectError' }).max(160, { message: 'form.tooLong' })

const message = z.string().trim().min(20, { message: 'form.messageError' }).max(4000, { message: 'form.tooLong' })

export const contactSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal('')),
  organization: z.string().trim().max(160, { message: 'form.tooLong' }).optional().or(z.literal('')),
  subject,
  message,
  consent: z.literal(true, { message: 'contact.form.consentError' }),
  website: z.string().max(0, { message: 'form.tooLong' }).optional(),
})

export const consultationSchema = z.object({
  name,
  organization: z.string().trim().min(2, { message: 'form.orgError' }).max(160, { message: 'form.tooLong' }),
  email,
  phone,
  serviceOfInterest: z.string().min(1, { message: 'consult.form.serviceError' }),
  projectDescription: message,
  preferredContactMethod: z.enum(['email', 'phone']).default('email'),
  website: z.string().max(0, { message: 'form.tooLong' }).optional(),
})

export const registrationSchema = z.object({
  full_name: name,
  email,
  phone,
  organization: z.string().trim().max(255, { message: 'form.tooLong' }).optional().or(z.literal('')),
  course_schedule_id: z.string().optional().or(z.literal('')),
  preferred_schedule: z.string().trim().max(255, { message: 'form.tooLong' }).optional().or(z.literal('')),
  additional_information: z.string().trim().max(3000, { message: 'form.tooLong' }).optional().or(z.literal('')),
  consent: z.literal(true, { message: 'contact.form.consentError' }),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(8, { message: 'admin.login.error' }),
})
