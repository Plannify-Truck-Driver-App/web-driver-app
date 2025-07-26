import type { UseFormReturn } from "react-hook-form";
import PasswordForm from "./password-form";
import PersonalInformationForm from "./personal-information-form";
import type { PersonalInformationSchema } from "../schemas/personal-information-schema";
import type { PasswordSchema } from "../schemas/password-schema";

interface RegisterFormProps {
  page: 1 | 2;
  personalInformationForm: UseFormReturn<PersonalInformationSchema>;
  passwordForm: UseFormReturn<PasswordSchema>;
  onSubmitPersonalInformation: (data: PersonalInformationSchema) => void;
  onSubmitPassword: (data: PasswordSchema) => void;
}

export default function RegisterForm({ page, personalInformationForm, passwordForm, onSubmitPersonalInformation, onSubmitPassword }: RegisterFormProps) {

  return (
    <div className="flex flex-row gap-4 w-full">
      <div className="w-full" style={page === 2 ? { display: "none" } : {}}>
        <PersonalInformationForm form={personalInformationForm} onSubmit={onSubmitPersonalInformation} />
      </div>
      <div className="hidden sm:block w-full" style={page === 2 ? { display: "block" } : {}}>
        <PasswordForm form={passwordForm} onSubmit={onSubmitPassword} />
      </div>
    </div>
  );
}
