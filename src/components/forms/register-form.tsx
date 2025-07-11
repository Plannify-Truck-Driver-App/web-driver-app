import type { RegisterSchema } from "@/pages/authentication/feature/register-page-feature";
import type { UseFormReturn } from "react-hook-form";
import { Form, FormField } from "../ui/form";
import { InputText } from "../ui/input-text";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import PasswordIndicator from "../ui/password-indicator";
import { useState, type SyntheticEvent } from "react";
import { generateStrongPassword } from "@/utils/functions/generate-strong-password";
import { toast } from "sonner";

interface RegisterFormProps {
  form: UseFormReturn<RegisterSchema>;
  onSubmit: (data: RegisterSchema) => void;
}

export default function RegisterForm({ form, onSubmit }: RegisterFormProps) {
  const [page, setPage] = useState(1);

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
        className="flex flex-row gap-4"
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row gap-2">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <InputText
                  {...field}
                  label="Prénom"
                  error={form.formState.errors.firstname?.message}
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                />
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <InputText
                  {...field}
                  label="Nom"
                  error={form.formState.errors.lastname?.message}
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                />
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="gender"
            render={() => (
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder="Sélectionnez un genre"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Genre</SelectLabel>
                    <SelectItem value="M">Monsieur</SelectItem>
                    <SelectItem value="Mme">Madame</SelectItem>
                    <SelectItem value="Other">Aucun</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <InputText
                {...field}
                label="Email"
                type="email"
                error={form.formState.errors.email?.message}
                disabled={form.formState.isSubmitting}
              />
            )}
          />
        </div>
        <div className="hidden sm:flex flex-col gap-4 w-full">
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
        </div>
      </form>
    </Form>
  );
}
