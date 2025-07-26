const SuspensionInformation: React.FC<{ contactEmail: string | null }> = ({ contactEmail }) => {

    return (
        <div className="absolute w-full px-4 right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 text-center dark: text-white">
            <p className="text-[#FF0000] py-3 border border-[#FF0000] rounded-lg">Accès refusé</p>
            <div className="h-14"></div>
            <div className="w-[60%] inline-block">
                <img src="/images/undraw_suspension.svg" alt="Suspension" />
            </div>
            <div className="h-10"></div>
            <p>Votre compte a été suspendu. Vous ne pouvez pas accéder à cette fonctionnalité.</p>
            <div className="h-2"></div>
            <p>Un soucis ? Contactez-nous : <a href={"mailto:" + contactEmail} className="text-[#4A7AB4]">{contactEmail}</a>.</p>
        </div>
    )
}

export default SuspensionInformation