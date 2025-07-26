import AuthContext from "providers/authentification.provider";
import { useContext } from "react";

const useAuthentification = () => {
  return useContext(AuthContext)
}

export default useAuthentification