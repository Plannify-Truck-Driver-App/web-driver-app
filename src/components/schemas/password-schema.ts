import { z } from "zod";

export const passwordSchema = z.object({
    password: z.string().min(1, "Le mot de passe est requis").max(100, "Le mot de passe ne peut pas dépasser 100 caractères"),
    confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise").max(100, "La confirmation du mot de passe ne peut pas dépasser 100 caractères"),
})

export type PasswordSchema = z.infer<typeof passwordSchema>;