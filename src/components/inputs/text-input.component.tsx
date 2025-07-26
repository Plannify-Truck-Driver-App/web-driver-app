import { Eye, EyeOff } from "lucide-react";
import { ChangeEventHandler, useState } from "react";

interface ITextInputProps {
    type: string,
    label: string | undefined,
    name?: string,
    value: string,
    placeholder: string,
    maxLength?: number,
    onChange: ChangeEventHandler,
    isError: boolean,
    onEnterPress?: (e: any) => void
}

const TextInput: React.FC<ITextInputProps> = ({ type, label, name, value, placeholder, maxLength, onChange, isError, onEnterPress }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className={"relative" + (value !== "" || label === undefined ? " mt-0" : " mt-2")}>
            <fieldset className={"relative border border-[#DADADA] dark:border-[#000000] bg-white dark:bg-[#141f30] rounded-lg w-full max-w-[400px] px-3 py-2" + (value !== "" && label !== undefined ? " pt-0" : "") + (isError ? " border-[#F73131]" : '')}>
                {value !== "" && label !== undefined && <legend className="text-gray-500 text-xs text-left px-1">{label}</legend>}
                <div className="flex flex-row justify-between items-center gap-2" style={ maxLength != null ? {height: '60px'} : {}}>
                    {
                        type === 'password' ? <>
                            <input type={showPassword ? 'text' : 'password'} name={name || ''} spellCheck="false" value={value} placeholder={placeholder} onChange={onChange} className={"relative w-full text-base border-0 bg-transparent font-['Sansation'] focus:outline-none " + (isError ? 'text-[#FE0000]' : 'text-black dark:text-white')} onKeyDown={onEnterPress ? ((e: any) => e.key === 'Enter' ? onEnterPress(e) : {}) : () => {}} />
                            {
                                showPassword ? <Eye className="cursor-pointer" onClick={() => setShowPassword(false)} /> : <EyeOff className="cursor-pointer" onClick={() => setShowPassword(true)} />
                            }
                        </> : <>
                            <input type={type} name={name || ''} value={value} maxLength={maxLength} spellCheck="false" placeholder={placeholder} onChange={onChange} className={"relative w-full text-base border-0 bg-transparent font-['Sansation'] focus:outline-none " + (isError ? 'text-[#FE0000]' : 'text-black dark:text-white')} onKeyDown={onEnterPress ? ((e: any) => e.key === 'Enter' ? onEnterPress(e) : {}) : () => {}} />
                            {
                            maxLength != null && maxLength > 0 ? (
                                <div className="absolute bottom-2.5 right-[18px] text-slate-400 text-xs">
                                    {value.length}/{maxLength}
                                </div>
                                ) : ''
                            }
                        </>
                    }
                </div>
            </fieldset>
        </div>
    );
}

export default TextInput;