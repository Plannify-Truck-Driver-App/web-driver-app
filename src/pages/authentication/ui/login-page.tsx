import LoginForm from "@/components/forms/login-form";
import { Button } from "@/components/ui/button";
import type { LoginSchema } from "../feature/login-page-feature";
import type { UseFormReturn } from "react-hook-form";

interface LoginPageProps {
  form: UseFormReturn<LoginSchema>,
  onSubmit: (data: LoginSchema) => void;
}

export default function LoginPage({ form, onSubmit }: LoginPageProps) {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-3xl font-bold">Se connecter à Plannify</h1>
      <div className="flex flex-col gap-6">
        <LoginForm form={form} onSubmit={onSubmit} />
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <p className="text-slate-400">Vous n'avez pas de compte ?</p>
            <a href="/register" className="text-blue-500 hover:underline">
              Inscrivez-vous
            </a>
          </div>
          <Button variant="secondary" onClick={form.handleSubmit(onSubmit)}>Se connecter</Button>
        </div>
      </div>
    </div>
  );
}
