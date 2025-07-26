import DotLoader from "./dot-loader.component"

interface ICenterPageLoaderProps {
    content: string
}

const CenterPageLoader: React.FC<ICenterPageLoaderProps> = ({ content }) => {
    return (
        <div className='absolute right-1/2 top-1/2 w-full -translate-y-1/2 translate-x-1/2'>
            <div className="px-4 text-center dark:text-white">
                <p>{content}</p>
                <DotLoader />
            </div>
        </div>
    )
}

export default CenterPageLoader