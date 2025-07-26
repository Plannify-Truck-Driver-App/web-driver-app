import moment from "moment";
import { InputMask } from "primereact/inputmask";

interface TimeInputProps {
    value: string,
    isError: boolean,
    placeholder?: string,
    inputType: 'keyboard' | 'interactive',
    isDisabled?: boolean,
    onChange: (e: any) => void,
    onEnterPress?: (e: any) => void
}

const TimeInput: React.FC<TimeInputProps> = ({ value, isError, placeholder, inputType, isDisabled, onChange, onEnterPress }) => {
    return (
        <div className="relative inline-block bg-white border-[#DADADA] dark:bg-[#141f30] rounded-lg max-w-[340px]">
            <div className={"border border-[#DADADA] dark:border-[#000000] p-1 rounded-lg " + (isError ? "border-[#F73131]" : '')}>
                {
                    inputType === 'keyboard' ? (
                        <InputMask value={value} onChange={onChange} mask="99:99:99" type="tel" placeholder={placeholder ?? moment(new Date()).format("HH:mm:ss")} disabled={isDisabled} className="text-base text-center outline-none p-0 m-0 w-[80px] dark:bg-[#141f30] dark:text-white" />
                    ) : (
                        <input value={value} onChange={onChange} onClick={onEnterPress} type="time" className="text-base text-center outline-none bg-white dark:bg-[#141f30] dark:text-white" disabled={isDisabled} />
                    )
                }
            </div>
        </div>
    )
}

export default TimeInput