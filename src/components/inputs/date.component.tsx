import moment from "moment"
import { InputMask } from "primereact/inputmask";
import { useId } from "react";

interface IDateInputProps {
    value: string,
    isError: boolean,
    inputType: 'keyboard' | 'interactive',
    id?: string,
    onChange: (e: any) => void,
    onEnterPress?: (e: any) => void
}

const DateInput: React.FC<IDateInputProps> = ({ value, isError, inputType, id, onChange, onEnterPress }) => {
    const dynamicId: string = useId()

    return (
        <div className="relative inline-block bg-white dark:bg-[#141f30] rounded-lg max-w-[340px]">
            <div className={"border border-[#DADADA] dark:border-black p-1 rounded-lg " + (isError ? "border-[#F73131]" : '')}>
                {
                    inputType === 'keyboard' ? (
                        <InputMask value={value} onChange={onChange} mask="99/99/9999" type="tel" placeholder={moment(new Date()).format("DD/MM/YYYY")} className="text-base text-center outline-none dark:bg-[#141f30] dark:text-white" />
                    ) : (
                        <input id={id ?? dynamicId} value={value} onChange={onChange} onClick={onEnterPress} type="date" className="text-base text-center outline-none bg-white dark:bg-[#141f30] dark:text-white" />
                    )
                }
            </div>
        </div>
    )
}

export default DateInput