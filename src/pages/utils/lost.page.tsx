import TemplateAuthentification from "components/templates/template-authentification.component";
import { SecondaryButton } from "components/buttons";
import { SyntheticEvent } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import useAuthentification from "hooks/useAuthentification.hook";

const LostPage: React.FC = () => {
    const navigation: NavigateFunction = useNavigate();

    const { authentification } = useAuthentification();

    const handleOnClick = (e: SyntheticEvent) => {
        e.preventDefault();

        if (authentification)
            navigation('/dashboard/semaine');
        else
            navigation('/');
    }

    return (
        <TemplateAuthentification title="Perdu ?" secondElementLargeDiv={{ content: <div className="w-[80%]"><img src="/images/undraw_lost.svg" alt="Perdu" /></div>, side: 'left' }} >
            <div className="text-center sm:flex sm:justify-center sm:items-center sm:h-full">
                <div className="sm:hidden">
                    <img src="/images/undraw_lost.svg" alt="Perdu" className="w-[80%]" />
                    <div style={{ height: '20px' }}></div>
                </div>
                <div>
                    <p>Oups vous vous êtes perdu...</p>
                    <div style={{ height: '10px' }}></div>
                    <SecondaryButton label="Page d'accueil" isDisabled={false} isLoading={false} onClick={ handleOnClick } />
                </div>
            </div>
        </TemplateAuthentification>
    )
}

export default LostPage;