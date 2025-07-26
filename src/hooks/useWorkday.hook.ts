import WorkdayContext, { WorkdayProviderProps } from "providers/workday.provider"
import { useContext } from "react"

const useWorkday = (): WorkdayProviderProps => {
    return useContext(WorkdayContext)
}

export default useWorkday