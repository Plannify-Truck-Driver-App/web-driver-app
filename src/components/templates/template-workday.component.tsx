import NavigationBar from "components/nav-bar/navigation-bar.component";
import React, { ReactNode } from "react";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import { useNavigate } from "react-router-dom";
import { SecondaryButton } from "components/buttons";
import useAuthentification from "hooks/useAuthentification.hook";
import { ArrowLeft } from "lucide-react";

interface TemplateWorkdayProps {
    title: string;
    onClickReturn?: () => void;
    rightIcon?: { icon: ReactNode, onClick: () => void }
    titleItems?: { title: string, isSelected: boolean, onClick: () => void }[];
    selectedSection: NavBarSection;
    updateMetaForOverlay?: boolean;
    children: ReactNode;
}

const TemplateWorkday: React.FC<TemplateWorkdayProps> = ({ title, onClickReturn, rightIcon, titleItems, selectedSection, updateMetaForOverlay, children }) => {
    const { authentification, setAuthentification } = useAuthentification();
    const navigate = useNavigate();

    const deconnexion = () => {
        if (authentification) {
            setAuthentification(null)
            navigate('/connexion')
        }
    }

    return (
        <main>
            {/* For mobiles */}
            <TemplateWorkdayMobile title={title} onClickReturn={onClickReturn} rightIcon={rightIcon} titleItems={titleItems} selectedSection={selectedSection} updateMetaForOverlay={updateMetaForOverlay} >
                {children}
            </TemplateWorkdayMobile>
            {/* Not a mobile */}
            <div className="hidden sm:block py-6 text-lg text-center" style={{ margin: '0 20px' }}>
                <p className="text-[22px] cursor-pointer dark:text-white" onClick={() => navigate('/')}>Plannify</p>
                <div className="w-full absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 text-center">
                    <div className="w-full max-w-[800px] inline-block bg-white dark:bg-[#141f30] px-5 py-4 rounded-lg border border-[#DADADA] dark:border-black dark:text-white">
                        <p className="text-[22px] text-left">En développement</p>
                        <div className="h-[20px]"></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px'}}>
                            <div className="flex justify-center items-center max-h-[400px] overflow-auto ">
                                <div className="w-[80%]">
                                    <img src="/images/undraw_work_time.svg" alt="En développement" />
                                </div>
                            </div>
                            <div className="flex flex-col justify-around h-full">
                                <p>Cette partie de l'application est en développement. Veuillez utiliser votre smartphone.</p>
                                <div>
                                    <SecondaryButton label="Déconnexion" isDisabled={false} isLoading={false} onClick={ () => deconnexion() } />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

const TemplateWorkdayMobile: React.FC<TemplateWorkdayProps> = ({ title, onClickReturn, rightIcon, titleItems, selectedSection, updateMetaForOverlay, children }) => {
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (metaTag) {
        if (updateMetaForOverlay === undefined || !updateMetaForOverlay) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                metaTag.setAttribute('content', '#141f30');
            else
                metaTag.setAttribute('content', '#232B35');
        }
        else 
            metaTag.setAttribute('content', '#12161B');
    }
    
    return (
        <div className="block sm:hidden">
            <div className="pb-[50px]">
                <div className="fixed z-50 w-full flex flex-col gap-4 justify-between items-center px-4 py-2 bg-[#232B35] dark:bg-[#141f30] text-white">
                    <div className="text-center text-xl w-full relative">
                        {
                            onClickReturn ? <ArrowLeft color="white" className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={onClickReturn} /> : <></>
                        }
                        <h1>{title}</h1>
                        {
                            rightIcon ? <div className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={rightIcon.onClick}>{rightIcon.icon}</div> : <></>
                        }
                    </div>
                    {
                        titleItems ? <div className="flex justify-between w-full px-4">
                            {
                                titleItems.map((item, index) => (
                                    <button key={index} onClick={item.onClick} className={"text-primary text-lg" + (item.isSelected ? " underline": "")}>{item.title}</button>
                                ))
                            }
                        </div> : <></>
                    }
                </div>
            </div>
            <div className="text-center">
                {children}
            </div>
            <NavigationBar selectedSection={selectedSection} />
        </div>
    )
}

export default TemplateWorkday;