import { ThreeDots } from "react-loader-spinner";

const DotLoader = () => {
    return (
        <ThreeDots
            visible={true}
            height="40"
            width="40"
            color="#101820"
            radius="3"
            ariaLabel="three-dots-loading"
            wrapperStyle={{ display: 'inline-block' }}
            wrapperClass=""
        />
    )
}

export default DotLoader