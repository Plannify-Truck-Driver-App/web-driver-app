import type { UseFormReturn } from "react-hook-form";
import { Form, FormField } from "../ui/form";
import { InputText } from "../ui/input-text";
import type { LoginSchema } from "@/pages/authentication/feature/login-page-feature";

interface LoginFormProps {
    form: UseFormReturn<LoginSchema>,
    onSubmit: (data: LoginSchema) => void;
}

export default function LoginForm({ form, onSubmit }: LoginFormProps) {
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:max-w-sm">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <InputText
                        {...field}
                        label="E-mail"
                        error={form.formState.errors.email?.message}
                        disabled={form.formState.isSubmitting}
                    />
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <InputText
                        {...field}
                        label="Mot de passe"
                        type="password"
                        error={form.formState.errors.password?.message}
                        disabled={form.formState.isSubmitting}
                        togglePasswordVisibility
                    />
                )}
            />
        </form>
    </Form>
  )
}
