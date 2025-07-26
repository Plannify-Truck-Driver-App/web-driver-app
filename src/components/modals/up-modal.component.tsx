interface UpModalProps {
    onCancel: () => void,
    children: React.ReactNode;
}

const UpModal: React.FC<UpModalProps> = ({ onCancel, children }) => {

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] duration-[2000ms]" onClick={onCancel} style={window.matchMedia('(display-mode: standalone)').matches ? { paddingBottom: 'calc(48px + env(safe-area-inset-bottom))' } : {}}>
            <div className="absolute bottom-0 w-full bg-white dark:bg-[#141f30] dark:text-white rounded-t-lg px-4 py-2 pb-6 duration-[500ms] translate-y-0 animate-[slideUp_10s_forwards]" onClick={(e: any) => {e.stopPropagation()}}>
                {children}
            </div>
        </div>
    )
}

export default UpModal;