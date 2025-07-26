const LocalStorageLoadingPage: React.FC = () => {
    return (
        <main className="py-7 px-4 text-lg text-center dark:text-white">
            <div style={{ position: 'relative' }}>
                <p className="text-[22px]">Plannify</p>
            </div>
            <div style={{ height: '70px' }}></div>
            <div>
                <img src="/images/undraw_dreamer.svg" alt="Chargement" className="inline-block w-[60%] max-w-[400px]" />
                <div style={{ height: '20px' }}></div>
                <p>Récupération de vos informations en cours...</p>
            </div>
        </main>
    )
}

export default LocalStorageLoadingPage;