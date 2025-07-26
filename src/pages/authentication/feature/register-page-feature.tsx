import RegisterPage from "../ui/register-page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo, useState, type SyntheticEvent } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import { personalInformationSchema, type PersonalInformationSchema } from "@/components/schemas/personal-information-schema";
import { passwordSchema, type PasswordSchema } from "@/components/schemas/password-schema";

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

    const personalInformationForm = useForm<PersonalInformationSchema>({
        resolver: zodResolver(personalInformationSchema),
        defaultValues: {
            firstname: '',
            lastname: '',
            gender: undefined,
            email: '',
        },
    });

    const passwordForm = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmitPersonalInformation = (data: PersonalInformationSchema) => {
        if (isMobile && page === 1) {
            setPage(2);
        } else {
            console.log("Form submitted", data);
        }
    }

    const onSubmitPassword = (data: PasswordSchema) => {
        console.log("Password form submitted", data);
    }

    const submitForms = (e: SyntheticEvent) => {
        e.preventDefault();

        const personalInformationValid = personalInformationForm.formState.isValid;
        const passwordValid = passwordForm.formState.isValid;

        if (!personalInformationValid) {
            personalInformationForm.trigger();
        }

        if (!passwordValid) {
            passwordForm.trigger();
        }

        if (personalInformationValid && passwordValid) {
            const personalInformationData = personalInformationForm.getValues();
            const passwordData = passwordForm.getValues();

            console.log("All forms are valid, submitting...");
            console.table({...personalInformationData, ...passwordData});
        }
    }

    const onCancel = () => {
        if (isMobile && page === 2) {
            setPage(1);
        } else {
            navigate("/login");
        }
    }

    const getFormattedFirstname = useCallback(() => {
        const firstname = personalInformationForm.getValues('firstname');
        return firstname ? firstname.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-') : '';
    }, [personalInformationForm]);

    const pageTitle = useMemo<string>(() => {
        return page === 1 ? "S'inscrire à Plannify" : `Bonjour ${getFormattedFirstname()}, vous y êtes presque`;
    }, [page, getFormattedFirstname]);

    return <RegisterPage page={page} isMobile={isMobile} pageTitle={pageTitle} registerButtonContent={registerButtonContent} previousButtonContent={previousButtonContent} personalInformationForm={personalInformationForm} passwordForm={passwordForm} onSubmitPersonalInformation={onSubmitPersonalInformation} onSubmitPassword={onSubmitPassword} submitForms={submitForms} onCancel={onCancel} />;
}