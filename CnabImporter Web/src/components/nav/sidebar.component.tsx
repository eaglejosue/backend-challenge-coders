import { useNavigate } from 'react-router-dom';
import { AuthenticatedUserModel } from '../../common/models/authenticated.model';
import Logo from '../../assets/img/favicon-32x32.png';
import paths from '../../routes/paths';
import './sidebar.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {  Button, Offcanvas } from 'react-bootstrap';

export interface Props {
  navItem: string
}

const Sidebar = (p: Props) => {
  const navigate = useNavigate();
  //const user = AuthenticatedUserModel.fromLocalStorage();
  const [user, setUser] = useState<AuthenticatedUserModel>();

    useEffect(() => {
      const user = AuthenticatedUserModel.fromLocalStorage();
      if (user && user.token?.length) setUser(user);
    }, []);
    const logout = () => {
      AuthenticatedUserModel.removeLocalStorage();
      navigate(paths.LOGIN);
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


  return (
    <>
      <div
        className="d-flex flex-column bg-white border-end p-0 desktopShowSideBar"
        style={{ width: "4.2rem", height: "100vh" }}
      >
        <ul className="nav nav-pills flex-column align-items-center">
          <li className="nav-item mt-2 mb-4">
            <img
              src={Logo}
              alt="Logo"
              className="nav-link"
              onClick={() => navigate(paths.HOME_LOGGED)}
            />
          </li>

          <li
            className={
              p.navItem == "home" ? "bg-iautor-color nav-border-right" : ""
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
              p?.navItem == "book" ? "bg-iautor-color nav-border-right" : ""
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
              p?.navItem == "my-histories"
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

      <div className="mobileShowSideBar">
      <Button variant="text-white" className="d-lg-none p-3" onClick={handleShow}>
          <FontAwesomeIcon icon={faBars} />
      </Button>

      <Offcanvas show={show} onHide={handleClose} responsive="lg">
        <Offcanvas.Header closeButton className='bgHeaderSideBar'>
          <Offcanvas.Title>XXXXXXXXX</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='bgHeaderSideBar p-0'>
        <div className="row text-start m-4 ">
              <div className="col-12">
                {user?.profileImgUrl ? (
                  <img
                    src={user.profileImgUrl}
                    alt={user.firstname}
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
                  {user?.firstname} {user?.lastname}
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
                      onClick={() => {navigate(paths.HOME_LOGGED); setShow(false)}}
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
                        {navigate(`${paths.NEW_HISTORY}/${user?.lastBookId}`); setShow(false)}
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
                      onClick={() => {navigate(paths.MY_HISTORIES);setShow(false)}}
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
                      onClick={() => {navigate(paths.PRICING_PLANS);setShow(false)}}
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
                      onClick={() => logout()}
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
      </div>
    </>
  );
};

export default Sidebar;