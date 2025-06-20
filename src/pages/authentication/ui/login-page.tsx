import LoginForm from "@/components/forms/login-form";
import { Button } from "@/components/ui/button";
import type { LoginSchema } from "../feature/login-page-feature";
import type { UseFormReturn } from "react-hook-form";
import { useNavigate, type NavigateFunction } from "react-router";

interface LoginPageProps {
  form: UseFormReturn<LoginSchema>,
  onSubmit: (data: LoginSchema) => void;
}

export default function LoginPage({ form, onSubmit }: LoginPageProps) {

  const navigate: NavigateFunction = useNavigate()

  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-3xl font-bold">Se connecter à Plannify</h1>
      <div className="flex flex-col gap-6">
        <LoginForm form={form} onSubmit={onSubmit} />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="hidden sm:flex flex-row items-center gap-2">
            <p className="text-slate-400">Vous n'avez pas de compte ?</p>
            <a href="/register" className="text-secondary hover:underline">
              Inscrivez-vous
            </a>
          </div>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={form.handleSubmit(onSubmit)}>Se connecter</Button>
          <Button variant="outline" className="inline-block sm:hidden w-full sm:w-auto bg-neutral" onClick={() => navigate("/register")}>S'inscrire</Button>
        </div>
      </div>
    </div>
  );
}
