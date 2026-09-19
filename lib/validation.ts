import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(120),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(5000).optional(),
  visibility: z.enum(["private", "school", "public"]).default("private"),
});

export const ideaSchema = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(10).max(5000),
});

export const goalSchema = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().max(2000).optional(),
  targetDate: z.string().datetime().optional(),
});
