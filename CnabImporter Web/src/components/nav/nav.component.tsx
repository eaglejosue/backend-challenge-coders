import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faDollarSign,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import useScreenSize from "../../hooks/useScreenSize";
import useUserLogged from "../../hooks/useUserLogged";
import paths from "../../routes/paths";
import Logo from "../../assets/img/Logo.png";
import NavUserOptions from "./nav-user-options.component";

export interface Props {
  viewPlanBtn?: boolean;
}

const Nav: React.FC<Props> = ({ viewPlanBtn = true }) => {
  const navigate = useNavigate();
  const { isExtraSmallScreen, isSmallScreen } = useScreenSize();
  const userIsLogged = useUserLogged();

  return (
    <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3   ">
      <div className="col-md-auto mb-2 mb-md-0">
        <img
          src={Logo}
          alt="Logo"
          className="p-4"
          height={isExtraSmallScreen || isSmallScreen ? "80" : "auto"}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(paths.HOME)}
        />
      </div>
      {viewPlanBtn && (
        <div className="col-md">
          {!isExtraSmallScreen ? (
            <a
              href="#plans"
              className="btn btn-outline-secondary rounded-5 f-14 px-4 py-2"
            >
              Ver Pacotes
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-primary ms-2 pt-1"
              />
            </a>
          ) : (
            <a
              href="#plans"
              className="text-secondary d-flex justify-content-center align-items-center"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "100%",
                marginRight: "15px",
                marginLeft: "5rem",
                borderStyle: "solid",
              }}
            >
              <FontAwesomeIcon icon={faDollarSign} />
            </a>
          )}
        </div>
      )}
      <div className="col-md-auto text-end">
        {userIsLogged ? (
          <NavUserOptions />
        ) : (
          <>
            {isExtraSmallScreen || isSmallScreen ? (
              <button
                className="text-secondary d-flex justify-content-center align-items-center"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "100%",
                  borderStyle: "solid",
                  backgroundColor: "#ffffff",
                }}
                onClick={() => navigate(paths.LOGIN)}
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-secondary rounded-5 f-14 px-4 py-2 me-3"
                  onClick={() => navigate(paths.LOGIN)}
                >
                  Login
                </button>
                <button
                  className="btn bg-secondary text-white rounded-5 f-14 px-4 py-2"
                  onClick={() => navigate(paths.LOGIN)}
                >
                  Experimente Criar uma História
                </button>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Nav;
