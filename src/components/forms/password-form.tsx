import type { UseFormReturn } from "react-hook-form";
import { Form, FormField } from "../ui/form";
import { InputText } from "../ui/input-text";
import PasswordIndicator from "../ui/password-indicator";
import type { SyntheticEvent } from "react";
import { generateStrongPassword } from "@/utils/functions/generate-strong-password";
import { toast } from "sonner";
import type { PasswordSchema } from "../schemas/password-schema";

interface PasswordFormProps {
    form: UseFormReturn<PasswordSchema>;
    onSubmit: (data: PasswordSchema) => void;
}

export default function PasswordForm({ form, onSubmit }: PasswordFormProps) {
    const handleGenerateStrongPassword = async (e: SyntheticEvent) => {
        e.preventDefault();

        const password = generateStrongPassword();
        form.setValue("password", password);
        form.setValue("confirmPassword", password);

        try {
            await navigator.clipboard.writeText(password);
            toast.info("Le mot de passe a été copié dans le presse-papiers.");
        } catch (error) {
            console.error("Erreur lors de la copie du mot de passe : ", error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
            >
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
                    />
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                    <InputText
                        {...field}
                        label="Confirmer le mot de passe"
                        type="password"
                        error={form.formState.errors.confirmPassword?.message}
                        disabled={form.formState.isSubmitting}
                    />
                    )}
                />
                <div className="flex flex-col gap-2">
                    <a
                        className="text-sm text-secondary hover:underline"
                        href=""
                        onClick={handleGenerateStrongPassword}
                    >
                        Générer un mot de passe
                    </a>
                    <PasswordIndicator password={form.watch("password")} />
                </div>
            </form>
        </Form>
    )
}