import AuthContext from "providers/authentification.provider";
import { useContext } from "react";
import { Location, Navigate, Outlet, useLocation } from "react-router-dom";

function RequiereAuthentification() {
    const { authentification } = useContext(AuthContext);
    const localisation: Location<any> = useLocation();

    return (
        authentification ? 
        <Outlet /> : 
        <Navigate to='/connexion' state={{ from: localisation }} replace />
    )
}

export default RequiereAuthentification;