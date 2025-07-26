import { ButtonDotLoader } from "components/loaders";
import { MouseEventHandler } from "react";

interface MainButtonProps {
    label: string;
    isDisabled: boolean;
    isLoading: boolean;
    onClick: MouseEventHandler;
    fullWidth?: boolean;
    colors?: {
        enabled: {
            background: string;
            border: string;
            text: string;
        },
        disabled: {
            background: string;
            border: string;
            text: string;
        }
    }
}

const MainButton: React.FC<MainButtonProps> = ({ label, isDisabled, isLoading, onClick, fullWidth, colors }) => {
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const enabledStyles = colors ? colors.enabled : { background: !darkmode ? '#232B35' : '#1887a3', border: !darkmode ? '#101820' : '#196d82', text: 'white' };
    const disabledStyles = colors ? colors.disabled : { background: !darkmode ? '#545C66' : '#7fb3c1', border: !darkmode ? '#414A52' : '#4c818e', text: 'white' };

    return (
        <button
            className={`transition-all delay-100 inline-block px-5 py-1.5 text-lg border-2 border-b-[5px] rounded-lg active:mt-[3px] active:border-b-[2px] translate-y-[3px] disabled:cursor-not-allowed disabled:active:mt-0 disabled:active:border-b-[5px] cursor-pointer ${fullWidth ? 'w-full' : ''}`}
            disabled={isDisabled}
            onClick={isLoading ? () => {} : onClick}
            style={{
                backgroundColor: isDisabled ? disabledStyles.background : enabledStyles.background,
                borderColor: isDisabled ? disabledStyles.border : enabledStyles.border,
                color: isDisabled ? disabledStyles.text : enabledStyles.text,
                ...isLoading ? { margin: 0, padding: '0px 20px' } : {}
            }}
        >
            {isLoading ? <div className="flex justify-center content-center px-3 py-1"><ButtonDotLoader /></div> : label}
        </button>
    );
}

export default MainButton;
