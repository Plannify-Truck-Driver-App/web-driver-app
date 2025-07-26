import { CircleCheck, CircleX } from "lucide-react"

export interface IPasswordPropertiesProps {
    length: boolean,
    uppercase: boolean,
    lowercase: boolean,
    number: boolean,
    special: boolean
}

const PasswordPropertiesCheck: React.FC<{ passwordProperties: IPasswordPropertiesProps, samePassword: boolean }> = ({ passwordProperties, samePassword }) => {
    return (
        <div>
            <p className={"flex items-center gap-1.5 my-0.5 " + (passwordProperties.length ? "text-[#2dae36]" : "text-[#F83F3F]")}>{ passwordProperties.length ? <CircleCheck /> : <CircleX /> }Au minimum 10 caractères</p>
            <p className={"flex items-center gap-1.5 my-0.5 " + (passwordProperties.uppercase ? "text-[#2dae36]" : "text-[#F83F3F]")}>{ passwordProperties.uppercase ? <CircleCheck /> : <CircleX /> }Au minimum une majuscule</p>
            <p className={"flex items-center gap-1.5 my-0.5 " + (passwordProperties.lowercase ? "text-[#2dae36]" : "text-[#F83F3F]")}>{ passwordProperties.lowercase ? <CircleCheck /> : <CircleX /> }Au minimum une minuscule</p>
            <p className={"flex items-center gap-1.5 my-0.5 " + (passwordProperties.number ? "text-[#2dae36]" : "text-[#F83F3F]")}>{ passwordProperties.number ? <CircleCheck /> : <CircleX /> }Au minimum un chiffre</p>
            <p className={"flex items-center gap-1.5 my-0.5 " + (passwordProperties.special ? "text-[#2dae36]" : "text-[#F83F3F]")}>{ passwordProperties.special ? <CircleCheck /> : <CircleX /> }Au minimum un caractère spécial</p>
            <p className={"flex items-center gap-1.5 my-0.5 " + (samePassword ? "text-[#2dae36]" : "text-[#F83F3F]")}>{ samePassword ? <CircleCheck /> : <CircleX /> }Les mots de passe sont identiques</p>
        </div>
    )
}

export default PasswordPropertiesCheck;