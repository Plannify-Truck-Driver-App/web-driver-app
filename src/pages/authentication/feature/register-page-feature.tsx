import { z } from "zod";
import RegisterPage from "../ui/register-page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router";

const registerSchema = z.object({
    firstname: z.string().min(1, "Un prénom est requis").max(50, "Le prénom ne peut pas dépasser 50 caractères"),
    lastname: z.string().min(1, "Un nom de famille est requis").max(50, "Le nom de famille ne peut pas dépasser 50 caractères"),
    gender: z.enum(['M', 'Mme', 'other'], {
        errorMap: () => ({ message: "Le genre est requis" }),
    }),
    email: z.string().email("L'adresse e-mail doit être valide"),
    password: z.string().min(1, "Le mot de passe est requis").max(100, "Le mot de passe ne peut pas dépasser 100 caractères"),
    confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise").max(100, "La confirmation du mot de passe ne peut pas dépasser 100 caractères"),
})

export type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPageFeature() {
    const [page, setPage] = useState<1 | 2>(1);
    const isMobile = window.innerWidth < 640;

    const registerButtonContent = useMemo<string>(() => {
        return isMobile && page === 1 ? "Continuer" : "S'inscrire";
    }, [page, isMobile]);
    const previousButtonContent = useMemo<string>(() => {
        return page === 1 ? "Se connecter" : "Précédent";
    }, [page]);

    const navigate: NavigateFunction = useNavigate()

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

    const onSubmit = () => {
        if (isMobile && page === 1) {
            setPage(2);
        } else {
            console.log("Form submitted", form.getValues());
            // Handle form submission logic here
        }
    }

    const onCancel = () => {
        if (isMobile && page === 2) {
            setPage(1);
        } else {
            navigate("/login");
        }
    }

    return <RegisterPage page={page} registerButtonContent={registerButtonContent} previousButtonContent={previousButtonContent} form={form} onSubmit={onSubmit} onCancel={onCancel} />;
}