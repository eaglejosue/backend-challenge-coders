import { useNavigate } from "react-router-dom";

import paths from "../../routes/paths";
import Logo from "../../assets/img/Logo.png";
import NavUserOptions from "./nav-user-options.component";

const NavAdmin = () => {
  const navigate = useNavigate();

  return (
    <header className="container">
      <div className="row align-items-center">
        <div className="col-auto">
          <img
            src={Logo}
            alt="Logo"
            className="py-4"
            height={"auto"}
            onClick={() => navigate(paths.HOME)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="col">
          <NavUserOptions />
        </div>
      </div>
    </header>
  );
};

export default NavAdmin;
