import { Button } from "@/components/ui/button";
import type { UseFormReturn } from "react-hook-form";
import { useNavigate, type NavigateFunction } from "react-router";
import type { RegisterSchema } from "../feature/register-page-feature";
import RegisterForm from "@/components/forms/register-form";

interface RegisterPageProps {
    form: UseFormReturn<RegisterSchema>,
    onSubmit: (data: RegisterSchema) => void;
}

export default function RegisterPage({ form, onSubmit }: RegisterPageProps) {

    const navigate: NavigateFunction = useNavigate()

    return (
        <div className="flex flex-col gap-12">
        <h1 className="text-3xl font-bold">S'inscrire à Plannify</h1>
        <div className="flex flex-col gap-6">
            <RegisterForm form={form} onSubmit={onSubmit} />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="hidden sm:flex flex-row items-center gap-2">
                <p className="text-slate-400">Vous avez déjà un compte ?</p>
                <a href="/login" className="text-secondary hover:underline">
                Connectez-vous
                </a>
            </div>
            <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={form.handleSubmit(onSubmit)}
            >
                S'inscrire
            </Button>
            <Button
                variant="outline"
                className="inline-block sm:hidden w-full sm:w-auto bg-neutral"
                onClick={() => navigate("/login")}
            >
                Se connecter
            </Button>
            </div>
        </div>
        </div>
    );
}
