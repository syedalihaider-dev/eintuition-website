import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const packageSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case")
    .optional(),
  description: z.string().min(1),
  features: z.array(z.string().min(1)).min(1),
  billingPeriod: z.enum(["MONTHLY", "YEARLY"]),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().min(1).default("usd"),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const packageUpdateSchema = packageSchema.partial();

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional().nullable(),
  message: z.string().min(1),
});

export const quoteSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().min(1),
  website: z.string().min(1),
  services: z.array(z.string().min(1)).min(1),
  message: z.string().min(1),
});

export const checkoutSchema = z.object({
  packageId: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  opaqueData: z.object({
    dataDescriptor: z.string().min(1),
    dataValue: z.string().min(1),
  }),
});

export const customCheckoutSchema = z.object({
  amount: z.number().positive().max(999999.99),
  currency: z.string().min(1).default("usd"),
  note: z.string().max(255).optional(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  opaqueData: z.object({
    dataDescriptor: z.string().min(1),
    dataValue: z.string().min(1),
  }),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "CLOSED"]),
});

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
