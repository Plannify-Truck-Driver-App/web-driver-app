import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface TemplateAuthentificationProps {
    title: string;
    onClickReturn?: () => void;
    children: ReactNode;
    secondElementLargeDiv: { content: ReactNode, side: 'left' | 'right' } | null;
}

const TemplateAuthentification: React.FC<TemplateAuthentificationProps> = ({ title, onClickReturn, children, secondElementLargeDiv }) => {
    const navigate = useNavigate();

    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (metaTag) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            metaTag.setAttribute('content', '#0C1421');
        else
            metaTag.setAttribute('content', '#F6F8FB');
    }

    return (
        <main className="py-6 text-lg text-center dark:text-white">
            <div className="relative mx-4">
                {
                    onClickReturn ? <ArrowLeft style={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(0, -50%)' }} className="cursor-pointer" onClick={onClickReturn} /> : <></>
                }
                <p className="text-[22px] cursor-pointer" onClick={() => navigate('/')}>Plannify</p>
            </div>
            <div className="hidden sm:block w-full px-4 absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2">
                <div className="px-4 w-full max-w-[800px] inline-block bg-white dark:bg-[#141f30] px-5 py-4 rounded-lg border border-[#DADADA] dark:border-black">
                    <p className="text-[22px] text-left">{title}</p>
                    <div className="h-[10px]"></div>
                    <div style={ secondElementLargeDiv !== null ? {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px'} : {} }>
                        { secondElementLargeDiv && secondElementLargeDiv.side === 'left' ? <div className="flex justify-center items-center max-h-[400px] overflow-auto ">{secondElementLargeDiv.content}</div> : <></> }
                        <div>{children}</div>
                        { secondElementLargeDiv && secondElementLargeDiv.side === 'right' ? <div className="flex justify-center items-center max-h-[400px] overflow-auto ">{secondElementLargeDiv.content}</div> : <></> }
                    </div>
                </div>
            </div>
            <div className="sm:hidden w-full px-4 max-w-[400px] inline-block">
                <div className="h-[50px]"></div>
                <p className="text-[22px] text-left">{title}</p>
                <div className="h-[30px]"></div>
                {children}
            </div>
        </main>
    )
}

export default TemplateAuthentification;