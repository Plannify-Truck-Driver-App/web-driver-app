import { z } from "zod";

export const personalInformationSchema = z.object({
    firstname: z.string().min(1, "Un prénom est requis").max(50, "Le prénom ne peut pas dépasser 50 caractères"),
    lastname: z.string().min(1, "Un nom de famille est requis").max(50, "Le nom de famille ne peut pas dépasser 50 caractères"),
    gender: z.enum(['M', 'Mme', 'other'], {
        errorMap: () => ({ message: "Le genre est requis" }),
    }),
    email: z.string().email("L'adresse e-mail doit être valide")
});

export type PersonalInformationSchema = z.infer<typeof personalInformationSchema>;