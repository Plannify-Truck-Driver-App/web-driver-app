import SystemContext, { SystemProviderProps } from "providers/system.provider"
import { useContext } from "react"

const useSystem = (): SystemProviderProps => {
    return useContext(SystemContext)
}

export default useSystem