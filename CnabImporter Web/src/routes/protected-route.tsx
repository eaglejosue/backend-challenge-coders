import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { AuthenticatedUserModel } from "../common/models/authenticated.model";
import paths from './paths';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [userChecked, setUserChecked] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    const user = AuthenticatedUserModel.fromLocalStorage();
    if (user && user.token?.length) {
      const decodedJwt = jwtDecode(user.token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime <= decodedJwt.exp!) {
        setUserLogged(true);
      } else {
        AuthenticatedUserModel.removeLocalStorage();
        setUserLogged(false);
      }
    } else {
      setUserLogged(false);
    }
    setUserChecked(true);
  }, []);

  if (!userChecked) return null;
  if (!userLogged) return <Navigate to={paths.LOGIN} />;
  return children;
};
