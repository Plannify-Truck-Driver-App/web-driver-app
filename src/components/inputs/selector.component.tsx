interface ISelectorProps {
    options: {
        value: string,
        label: string
    }[],
    label: string | undefined,
    isError: boolean,
    defaultValue: string | null,
    onChange: Function,
    fullWidth?: boolean
}

const Selector: React.FC<ISelectorProps> = ({ options, label, isError, defaultValue, onChange, fullWidth }) => {
    return (
        <div className="relative">
            <fieldset className={"relative border border-[#DADADA] dark:border-[#000000] dark:bg-[#141f30] px-3 py-2 bg-white rounded-lg max-w-[400px]" + (label !== undefined ? " pt-0" : "") + (fullWidth ? " w-full" : "") + (isError ? "border-[#F73131]" : '')}>
                {label !== undefined && <legend className="text-gray-500 text-xs text-left px-1">{label}</legend>}
                <select onChange={(e: any) => onChange(e.target.value)} value={defaultValue ?? options[0].value} className={"relative w-full text-base cursor-pointer rounded-lg border-0 bg-transparent font-['Sansation'] focus:outline-none " + (isError ? 'text-[#FE0000]' : 'text-black dark:text-white')}>
                    {options.map(option => (
                        <option value={option.value} key={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </fieldset>
        </div>
    )
}

export default Selector