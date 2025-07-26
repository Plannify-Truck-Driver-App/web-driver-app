import { ButtonDotLoader } from "components/loaders";
import { MouseEventHandler } from "react";

interface SecondaryButtonProps {
    label: string;
    isDisabled: boolean;
    isLoading: boolean;
    onClick: MouseEventHandler;
    fullWidth?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, isDisabled, isLoading, onClick, fullWidth }) => {
    return (
        <button className={"transition-all delay-100 inline-block px-5 py-1.5 text-lg border-2 border-b-[5px] border-[#D9D9D9] rounded-lg bg-white text-[#232B35] active:mt-[3px] active:border-b-[2px] translate-y-[3px] disabled:bg-[#E4E4E4] disabled:border-[#DADADA] disabled:cursor-not-allowed disabled:active:mt-0 disabled:active:border-b-[5px] hover:cursor-pointer" + (fullWidth ? ' w-full' : '')} disabled={ isDisabled } onClick={ onClick }>
            { isLoading ? <div className="flex justify-center content-center px-3 py-1"><ButtonDotLoader /></div> : label }
        </button>
    );
}

export default SecondaryButton;