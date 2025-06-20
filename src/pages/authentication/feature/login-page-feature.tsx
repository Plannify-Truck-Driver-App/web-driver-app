import { useForm } from "react-hook-form";
import LoginPage from "../ui/login-page";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
    email: z.string().email("L'adresse e-mail doit être valide"),
    password: z.string().min(1, "Le mot de passe est requis").max(100, "Le mot de passe ne peut pas dépasser 100 caractères"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPageFeature() {
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    return <LoginPage form={form} onSubmit={data => console.log(data)} />
}