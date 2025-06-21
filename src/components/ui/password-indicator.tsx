import { PASSWORD_SECURITY } from "@/utils/constants/security";
import { useEffect, useState } from "react";

interface IPasswordStrengthProps {
    password: string
}

const PasswordIndicator: React.FC<IPasswordStrengthProps> = ({ password }) => {
    const [indicator, setIndicator] = useState<{ width: number, text: string, color: string }>({ width: 0, text: 'Veuillez saisir un mot de passe', color: '#7D7D7D' })

    const checkPasswordStrength = (password: string) => {
        const length: boolean = password.length >= PASSWORD_SECURITY.MIN_LENGTH.VALUE
        const uppercase: boolean = PASSWORD_SECURITY.REGEX_UPPERCASE.test(password)
        const lowercase: boolean = PASSWORD_SECURITY.REGEX_LOWERCASE.test(password)
        const number: boolean = PASSWORD_SECURITY.REGEX_NUMBER.test(password)
        const special: boolean = PASSWORD_SECURITY.REGEX_SPECIAL.test(password)

        const check = [
            {
                name: `Veillez à avoir ${PASSWORD_SECURITY.MIN_LENGTH.ERROR}`,
                value: length
            }, {
                name: `Veillez à avoir ${PASSWORD_SECURITY.MIN_UPPERCASE.ERROR}`,
                value: uppercase
            }, {
                name: `Veillez à avoir ${PASSWORD_SECURITY.MIN_LOWERCASE.ERROR}`,
                value: lowercase
            }, {
                name: `Veillez à avoir ${PASSWORD_SECURITY.MIN_NUMBER.ERROR}`,
                value: number
            }, {
                name: `Veillez à avoir ${PASSWORD_SECURITY.MIN_SPECIAL.ERROR}`,
                value: special
            }
        ]

        const width: number = check.filter(c => c.value).length / check.length * 100
        const firstCorrection: number = check.findIndex(c => !c.value)
        const text: string | undefined = password.length === 0 ? "Veuillez saisir un mot de passe" : firstCorrection === -1 ? undefined : check[firstCorrection].name

        setIndicator({
            width: width,
            text: text ?? 'Mot de passe robuste',
            color: width === 0 ? '#7D7D7D' : width < 50 ? '#ea3939' : width < 100 ? '#EA9139' : '#46d53f'
        })
    }

    useEffect(() => {
        checkPasswordStrength(password)
    }, [password])

    return (
        <div className="flex flex-col gap-2">
            <div className="w-full h-2 bg-[#D9D9D9] dark:bg-[#7D7D7D] rounded">
                <div 
                    className="h-2 bg-green-600 rounded transition-all duration-500 ease-in-out"
                    style={{
                        width: `${indicator.width}%`,
                        backgroundColor: indicator.color
                    }}
                ></div>
            </div>
            <p className="text-sm" style={{
                color: indicator.color
            }}>{ indicator.text }</p>
        </div>
    )
}

export default PasswordIndicator;