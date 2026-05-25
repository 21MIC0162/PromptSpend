import { z } from 'zod';
import type { AIProvider, AIPlan, UseCase } from '@/types';

export const aiProviders = [
  'cursor',
  'github-copilot',
  'claude',
  'chatgpt',
  'anthropic-api',
  'openai-api',
  'gemini',
  'windsurf',
] as const;

export const useCases = [
  'coding',
  'writing',
  'research',
  'data',
  'mixed',
] as const;

export const toolEntrySchema = z.object({
  id: z.string().uuid(),
  provider: z.enum(aiProviders),
  plan: z.string().min(1, 'Please select a plan'),
  monthlySpend: z
    .number()
    .min(0, 'Monthly spend must be 0 or greater')
    .max(100000, 'Monthly spend seems unusually high'),
  seats: z
    .number()
    .int('Seats must be a whole number')
    .min(1, 'At least 1 seat is required')
    .max(1000, 'Seats seem unusually high'),
});

export const auditFormSchema = z.object({
  tools: z
    .array(toolEntrySchema)
    .min(1, 'Add at least one AI tool')
    .max(20, 'Maximum 20 tools allowed'),
  teamSize: z
    .number()
    .int('Team size must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(10000, 'Team size seems unusually high'),
  primaryUseCase: z.enum(useCases),
});

export const leadFormSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name is too long'),
  role: z
    .string()
    .min(2, 'Role must be at least 2 characters')
    .max(50, 'Role is too long'),
  teamSize: z
    .number()
    .int('Team size must be a whole number')
    .min(1, 'Team size must be at least 1')
    .max(10000, 'Team size seems unusually high'),
  honeypot: z.string().max(0, 'Invalid submission').optional(),
});

export type ToolEntryFormData = z.infer<typeof toolEntrySchema>;
export type AuditFormDataInput = z.infer<typeof auditFormSchema>;
export type LeadFormDataInput = z.infer<typeof leadFormSchema>;
