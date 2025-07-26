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
import type { PersonalInformationSchema } from "../schemas/personal-information-schema";

interface PersonalInformationFormProps {
    form: UseFormReturn<PersonalInformationSchema>;
    onSubmit: (data: PersonalInformationSchema) => void;
}

export default function PersonalInformationForm({ form, onSubmit }: PersonalInformationFormProps) {

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
            >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
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
                        <Select onValueChange={field.onChange}>
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
                                    <SelectItem value="other">Aucun</SelectItem>
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
            </form>
        </Form>
    )
}