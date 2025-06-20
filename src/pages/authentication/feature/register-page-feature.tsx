import { z } from "zod";
import RegisterPage from "../ui/register-page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
    firstname: z.string().min(1, "Un prénom est requis").max(50, "Le prénom ne peut pas dépasser 50 caractères"),
    lastname: z.string().min(1, "Un nom de famille est requis").max(50, "Le nom de famille ne peut pas dépasser 50 caractères"),
    gender: z.enum(['M', 'Mme', 'Mlle', 'other'], {
        errorMap: () => ({ message: "Le genre est requis" }),
    }),
    email: z.string().email("L'adresse e-mail doit être valide"),
    password: z.string().min(1, "Le mot de passe est requis").max(100, "Le mot de passe ne peut pas dépasser 100 caractères"),
    confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise").max(100, "La confirmation du mot de passe ne peut pas dépasser 100 caractères"),
})

export type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPageFeature() {
    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            gender: 'M',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    return <RegisterPage form={form} onSubmit={data => console.log(data)} />;
}