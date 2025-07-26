interface FlatInformationProps {
    children: React.ReactNode,
    borderColor?: string,
    onClick?: () => void
}

const FlatInformation: React.FC<FlatInformationProps> = ({ children, borderColor, onClick }) => {

    return (
        <div
            className={"text-left w-[90%] text-base px-2 py-1 bg-white dark:bg-[#141f30] dark:text-white #DADADA dark:border-black border rounded-lg cursor-pointer"}
            style={{
                borderColor: borderColor ?? ""
            }}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default FlatInformation