interface InformationProps {
    children: React.ReactNode,
    borderColor?: {
        light: string,
        dark: string
    },
    backgroundColor?: {
        light: string,
        dark: string
    },
    emoji?: string
}

const Information: React.FC<InformationProps> = ({ children, borderColor, backgroundColor, emoji }) => {
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const backgroundStyle = backgroundColor ? { background: `#${!darkmode ? backgroundColor.light : backgroundColor.dark}` } : { background: 'white' };
    const borderStyle = borderColor ? { borderColor: `#${!darkmode ? borderColor.light : borderColor.dark}` } : { borderColor: '#DADADA' };
    
    return (
        <div className="relative py-5">
            {
                emoji && (
                    <div className="absolute right-2 top-0 w-10 h-10 border rounded-[50%] bg-white" style={{ ...backgroundStyle, ...borderStyle }}>
                        <div className="w-[100%] h-[100%] flex items-center justify-center">
                            <p>{emoji}</p>
                        </div>
                    </div>
                )
            }
            <div className={"inline-block text-left w-[90%] px-2 py-1 border rounded-lg text-base" } style={{ ...backgroundStyle, ...borderStyle }} >
                {children}
            </div>
        </div>
    )
}

export default Information;