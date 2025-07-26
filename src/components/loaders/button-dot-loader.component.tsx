import { ThreeDots } from "react-loader-spinner";

const ButtonDotLoader = () => {
  return (
    <ThreeDots
            visible={true}
            height="30"
            width="30"
            color="white"
            radius="3"
            ariaLabel="three-dots-loading"
            wrapperStyle={{ display: 'inline-block', margin: '0px', padding: '0px' }}
            wrapperClass=""
        />
  )
}

export default ButtonDotLoader