interface ICenterModalProps {
    onCancel: () => void,
    width?: string,
    size: { desktop: 'relative' | 'full', mobile: 'relative' | 'full' },
    children: React.ReactNode,
}

const CenterModal: React.FC<ICenterModalProps> = ({ onCancel, width, size, children }) => {

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] duration-[2000ms]" onClick={onCancel}>
            <div className={"absolute " + (width ?? "w-[80%]") + " bg-white dark:bg-[#141f30] dark:text-white rounded-lg p-4 duration-[500ms] " + (size.mobile === 'relative' ? 'right-1/2 top-1/2  -translate-y-1/2 translate-x-1/2' : 'inset-0 rounded-none w-full') + " " + (size.desktop === 'relative' ? 'sm:right-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-1/2' : 'sm:inset-0 rounded-none w-full') + " animate-[slideUp_10s_forwards]"} onClick={(e: any) => {e.stopPropagation()}}>
                {children}
            </div>
        </div>
    )
}

export default CenterModal