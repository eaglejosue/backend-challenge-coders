import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedUserModel } from "../../common/models/authenticated.model";
import paths from "../../routes/paths";
import NavUserOptions from "./nav-user-options.component";
import "./sidebar.scss";
import Logo from "../../assets/img/favicon-32x32.png";
import { Offcanvas } from "react-bootstrap";

export interface Props {
  navItem: string;
  navItemLabel: string;
}

const NavResponsive = (p: Props) => {


      const navigate = useNavigate();
      //const user = AuthenticatedUserModel.fromLocalStorage();
      const [user, setUser] = useState<AuthenticatedUserModel>();
      const [show, setShow] = useState(false);

      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
  useEffect(() => {
    const user = AuthenticatedUserModel.fromLocalStorage();
    if (user && user.token?.length) setUser(user);
  }, []);
  const logout = () => {
    AuthenticatedUserModel.removeLocalStorage();
    navigate(paths.LOGIN);
  };

  return (
    <>
      <nav
        className="navbar navbar-light  border-bottom p-2  fixed-top
                bg-white"
        style={{ minHeight: "70px" }}
      >
        <button
          className="navbar-toggler d-block d-md-none p-0 m-3"
          style={{ border: "none" }}
          onClick={()=>handleShow()}
          aria-controls="sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <span className="d-block d-md-none" style={{ flex: "auto" }}>
          <span className=" fw-bold f-18 pe-0">IAutor</span>
          <span className=" f-18 ps-1"> / {p.navItemLabel}</span>
        </span>

        <div className="clearfix w-100 d-none d-md-block ">
          <span className="float-start  ">
            <img
              src={Logo}
              alt="Logo"
              className="nav-link"
              style={{ marginLeft: "15px" }}
              onClick={() => navigate(paths.HOME_LOGGED)}
            />
          </span>
          <span className=" float-start px-4 ">
            <span className=" fw-bold f-18 pe-0">IAutor</span>
            <span className=" f-18 ps-1"> / {p.navItemLabel}</span>
          </span>
          <span className="float-end">
            <NavUserOptions />
          </span>
        </div>
      </nav>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton className="bgHeaderSideBar">
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bgHeaderSideBar p-0">
        <div className="row text-start m-4 ">
                       <div className="col-12">
                         {user?.profileImgUrl ? (
                           <img
                             src={user.profileImgUrl}
                             alt={user.firstname}
                             onClick={() => {navigate(paths.MY_ACCOUNT);}}
                             className="rounded-circle me-1"
                             style={{
                               width: "64px",
                               height: "64px",
                               objectFit: "cover",
                             }}
                           />
                         ) : (
                           <a target="_blank" style={{ color: "black" }}>
                             <FontAwesomeIcon icon={faUser} />
                           </a>
                         )}
                       </div>
                       <div className="col-12">
                         <h4 className="mt-2 mb-0">
                         <a
                               href="#"
                               className="nav-link text-white text-decoration-underline"
                               aria-label="Close"
                               onClick={() => { navigate(paths.MY_ACCOUNT);handleClose()}}
                             >
                           {user?.firstname} {user?.lastname}
                           </a>
                         </h4>
                         <small>Autor</small>
                       </div>
                       <div className="col-12 mt-3">
                         <button className="btn  text-white border border-white rounded-5 f-14 px-4 py-2">
                           Livro degustação&nbsp;|&nbsp;Tradicional
                         </button>
                       </div>
                     </div>

                     <div className="bgBodySideBar pt-3">
                       <div className="row text-start m-4 ">
                         <h3>
                           <strong>Menu</strong>
                         </h3>
                         <ul className="nav nav-pills flex-row align-items-start   ">
                           <li className="mb-3 ">
                             {" "}
                             <a
                               href="#"
                               className="nav-link text-white"
                               aria-label="Close"
                               onClick={() => {navigate(paths.HOME_LOGGED);handleClose()}}
                             >
                               <span
                                 className="material-symbols-outlined text-white "
                                 style={{ fontSize: "32px", color: "black" }}
                               >
                                 cottage
                               </span>
                               <span  className="p-4 ">Home</span>
                             </a>
                           </li>
                           <li className="mb-3">
                             {" "}
                             <a
                               href="#"
                               className="nav-link text-white"
                               onClick={() =>
                                 {navigate(`${paths.NEW_HISTORY}/${user?.lastBookId}`);handleClose() }
                               }
                             >
                               <span
                                 className="material-symbols-outlined text-white"
                                 style={{ fontSize: "32px", color: "black" }}
                               >
                                 book_2
                               </span>
                               <span className="p-4">Criar História</span>
                             </a>
                           </li>
                           <li className="mb-3">
                             {" "}
                             <a
                               href="#"
                               className="nav-link text-white"
                               onClick={() => {navigate(paths.MY_HISTORIES);handleClose()}}
                             >
                               <span
                                 className="material-symbols-outlined text-white"
                                 style={{ fontSize: "32px", color: "black" }}
                               >
                                 shelves
                               </span>
                               <span className="p-4">Minhas Histórias</span>
                             </a>
                           </li>
                           <li className="mb-3">
                             <a
                               href="#"
                               className="nav-link text-white"
                               onClick={() => {navigate(paths.PRICING_PLANS);handleClose()}}
                             >
                               <span
                                 className="material-symbols-outlined text-white"
                                 style={{ fontSize: "32px", color: "black" }}
                               >
                                 paid
                               </span>
                               <span className="p-4">Ver Planos</span>
                             </a>
                           </li>
                           <li className="mt-5">
                             <a
                               href="#"
                               className="nav-link text-white"
                               onClick={() => {logout();handleClose()}}
                             >
                               <span
                                 className="material-symbols-outlined text-white"
                                 style={{ fontSize: "32px", color: "black" }}
                               >
                                 logout
                               </span>
                               <span className="p-4 m-1">Sair</span>
                             </a>
                           </li>
                         </ul>
                       </div>
                     </div>
        </Offcanvas.Body>
      </Offcanvas>
      
     
      <div
        className=" d-none d-md-flex position-fixed "
        style={{ height: "100vh", marginTop: "70px" }}
      >
        <div
          className="d-flex flex-column bg-white border-end p-0"
          style={{ width: "4.2rem", height: "100vh" }}
        >
          <ul className="nav nav-pills flex-column align-items-center align-top">
            <li
              className={
                p.navItem.toLocaleLowerCase() == "home"
                  ? "bg-iautor-color nav-border-right"
                  : ""
              }
            >
              <a
                href="#"
                className="nav-link"
                onClick={() => navigate(paths.HOME_LOGGED)}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "32px", color: "black" }}
                >
                  cottage
                </span>
              </a>
            </li>

            <li
              className={
                p?.navItem.toLocaleLowerCase() == "book"
                  ? "bg-iautor-color nav-border-right"
                  : ""
              }
            >
              <a
                href="#"
                className="nav-link"
                onClick={() =>
                  navigate(`${paths.NEW_HISTORY}/${user?.lastBookId}`)
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "32px", color: "black" }}
                >
                  book_2
                </span>
              </a>
            </li>

            <li
              className={
                p?.navItem.toLocaleLowerCase() == "my-histories"
                  ? "bg-iautor-color nav-border-right"
                  : ""
              }
            >
              <a
                href="#"
                className="nav-link"
                onClick={() => navigate(paths.MY_HISTORIES)}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "32px", color: "black" }}
                >
                  shelves
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default NavResponsive;
