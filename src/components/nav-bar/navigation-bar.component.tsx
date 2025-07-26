import { Building, CalendarSearch, FileText, Truck, User } from "lucide-react";
import { ReactNode } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { NavBarSection } from "models/enums/nav-bar-section.enum";
import useSystem from "hooks/useSystem.hook";

interface INavigationBarProps {
    selectedSection: NavBarSection
}

const NavigationBar: React.FC<INavigationBarProps> = ({ selectedSection }) => {
    const { systemContext } = useSystem();
    const navigate: NavigateFunction = useNavigate()

    const sections: { name: string, icon: ReactNode, type: NavBarSection, redirection: string, notificationBadge?: { color: string, count: number } }[] = [
        {
            name: 'Accueil',
            icon: <Truck size={'30px'} strokeWidth={1} />,
            type: NavBarSection.HOME,
            redirection: '/dashboard/semaine'
        },
        {
            name: 'Journées',
            icon: <CalendarSearch size={'30px'} strokeWidth={1} />,
            type: NavBarSection.JOURNEYS,
            redirection: '/dashboard/journees'
        },
        {
            name: 'Documents',
            icon: <FileText size={'30px'} strokeWidth={1} />,
            type: NavBarSection.PDF,
            redirection: '/dashboard/documents'
        },
        {
            name: 'Entreprise',
            icon: <Building size={'30px'} strokeWidth={1} />,
            type: NavBarSection.COMPANY,
            redirection: '/dashboard/entreprise'
        },
        {
            name: 'Compte',
            icon: <User size={'30px'} strokeWidth={1} />,
            type: NavBarSection.PROFILE,
            redirection: '/dashboard/compte',
            notificationBadge: systemContext.maintenances.data.length === 0 ? undefined : {
                color: '#e9620f',
                count: systemContext.maintenances.data.length
            }
        }
    ]

    return (
        <div className="fixed bottom-0 z-50 w-full px-4 py-2 flex justify-between bg-white dark:bg-[#141f30] border border-[#DADADA] dark:border-[#141f30]" style={window.matchMedia('(display-mode: standalone)').matches ? { paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' } : {}}>
            {
                sections.map((selection, index: number) => (
                    <div className="relative">
                        <div key={index} className={`flex flex-col items-center cursor-pointer ${selectedSection === selection.type ? 'text-[#232B35] dark:text-white' : 'text-gray-400'}`} onClick={() => navigate(selection.redirection)}>
                            {selection.icon}
                            <p className="text-sm">{selection.name}</p>
                            {
                                selection.notificationBadge ? (
                                    <div className={"absolute top-0 right-0 w-5 h-5 rounded-full flex justify-center items-center text-white text-sm"} style={{ transform: 'translate(30%, -30%)', backgroundColor: selection.notificationBadge.color }}>
                                        {selection.notificationBadge.count}
                                    </div>
                                ) : <></>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default NavigationBar;