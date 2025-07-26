import { Button } from "@/components/ui/button";
import type { UseFormReturn } from "react-hook-form";
import RegisterForm from "@/components/forms/register-form";
import type { PersonalInformationSchema } from "@/components/schemas/personal-information-schema";
import type { PasswordSchema } from "@/components/schemas/password-schema";
import type { SyntheticEvent } from "react";

interface RegisterPageProps {
    page: 1 | 2;
    isMobile: boolean;
    pageTitle: string;
    registerButtonContent: string;
    previousButtonContent: string;
    personalInformationForm: UseFormReturn<PersonalInformationSchema>;
    passwordForm: UseFormReturn<PasswordSchema>;
    onSubmitPersonalInformation: (data: PersonalInformationSchema) => void;
    onSubmitPassword: (data: PasswordSchema) => void;
    submitForms: (e: SyntheticEvent) => void;
    onCancel: () => void;
}

export default function RegisterPage({ page, isMobile,pageTitle, registerButtonContent, previousButtonContent, personalInformationForm, passwordForm, onSubmitPersonalInformation, onSubmitPassword, submitForms, onCancel }: RegisterPageProps) {
    return (
        <div className="flex flex-col gap-12">
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
            <div className="flex flex-col gap-6">
                <RegisterForm page={page} personalInformationForm={personalInformationForm} passwordForm={passwordForm} onSubmitPersonalInformation={onSubmitPersonalInformation} onSubmitPassword={onSubmitPassword} />
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
                        onClick={isMobile && page === 1 ? personalInformationForm.handleSubmit(onSubmitPersonalInformation) : submitForms}
                    >
                        {registerButtonContent}
                    </Button>
                    <Button
                        variant="outline"
                        className="inline-block sm:hidden w-full sm:w-auto bg-neutral"
                        onClick={onCancel}
                    >
                        {previousButtonContent}
                    </Button>
                </div>
            </div>
        </div>
    );
}
