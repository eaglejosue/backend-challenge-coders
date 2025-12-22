import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { AuthenticatedUserModel } from "../common/models/authenticated.model";

const useUserLogged = () => {
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    const handleUserLogged = () => {
      setUserLogged(true);
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
    };

    handleUserLogged();
    window.addEventListener("userLogged", handleUserLogged);

    return () => {
      window.removeEventListener("userLogged", handleUserLogged);
    };
  }, []);

  return userLogged;
};

export default useUserLogged;
