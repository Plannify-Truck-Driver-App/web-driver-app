import type { RegisterSchema } from "@/pages/authentication/feature/register-page-feature";
import type { UseFormReturn } from "react-hook-form";
import { Form, FormField } from "../ui/form";
import { InputText } from "../ui/input-text";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface RegisterFormProps {
    form: UseFormReturn<RegisterSchema>,
    onSubmit: (data: RegisterSchema) => void;
}

export default function RegisterForm({ form, onSubmit }: RegisterFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-4">
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
                        render={({ field }) => (
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionnez un genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Genre</SelectLabel>
                                    <SelectItem value="M">Monsieur</SelectItem>
                                    <SelectItem value="Mlle">Madame</SelectItem>
                                    <SelectItem value="Mme">Mademoiselle</SelectItem>
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
                <div className="flex flex-col gap-4 w-full">
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
                </div>
            </form>
        </Form>
    );
}