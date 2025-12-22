import { Button, Card, Dropdown, Table } from "react-bootstrap"
import { bookuserbooks } from "../../../assets/svg";
import { differenceInDays } from 'date-fns';
import React from "react";
import { BookModel } from "../../../common/models/book.model";
import { AuthenticatedUserModel } from "../../../common/models/authenticated.model";
import { useNavigate } from "react-router-dom";
import paths from "../../../routes/paths";
import { PlanModel } from "../../../common/models/plan.model";

interface BooksHistoryProps {
  book: BookModel | null;
  user: AuthenticatedUserModel | null;
  handlerSelect(): void;
  plan: PlanModel | null;
}
const BooksHistory = ({ book, user, handlerSelect, plan }: BooksHistoryProps) => {
  const navigate = useNavigate();

  const CustomToggle = React.forwardRef(({ children, onClick }: any, ref) => (
    <a
      href=""
      style={{ textDecoration: 'none' }}
      //@ts-ignore
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <span className="threedots" />
    </a>
  ));
  const getInitialName = (firstName: string | undefined, lastName: string | undefined) => {

    return `${firstName != undefined ? firstName[0] : ''}`.toLocaleUpperCase() +
      `${lastName != undefined ? lastName[0] : ''}`.toLocaleUpperCase();
  };
  return (
    <>
      <div className="d-block d-md-none text-center pb-3">
        <strong>
          <h3>Bem vindo, {user?.firstname + " " + user?.lastname}</h3>
        </strong>
      </div>
      <div
        className="col-12 border rounded bg-white"
        style={{ minHeight: "250px" }}
      >
        <div className="row m-lg-5">
          <div className="col-md-8 historyLogged">
            <h4>
              <strong>Histórias recentes</strong>
            </h4>
            <p>Histórias recentemente criadas ou modificadas por você.</p>
          </div>
          <div className="col-md-2 text-end d-none d-md-block">
            <Button
              variant=" btn-secondary"
              onClick={() => navigate(paths.PRICING_PLANS)}
              className=" rounded-5  f-14  p-3 d-none d-md-block"
            >
              <strong>Criar história</strong>
            </Button>
          </div>
          <div className="col-md-2 text-end gap-2 d-grid d-md-none ">
            <Button
              variant=" btn-secondary"
              onClick={() => navigate(paths.PRICING_PLANS)}
              className=" rounded-5  f-14  p-3 historyLoggedButton"
            >
              <strong>Criar história</strong>
            </Button>
          </div>

          <div className="col-md-2 text-end">
            <Button
              variant="outline-secondary "
              className=" rounded-5  f-14  p-3 d-none d-md-block"
              onClick={() => navigate(paths.MY_HISTORIES)}
            >
              <strong>Minhas histórias</strong>
            </Button>
            <div className="col-md-2 text-end d-grid gap-2 d-md-none historyLoggedButton">
              <Button
                variant="outline-secondary "
                className=" rounded-5  f-14  p-3"
                onClick={() => navigate(paths.MY_HISTORIES)}
              >
                <strong>Minhas histórias</strong>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="row m-5 d-none d-md-block">
          <div className="col-12">
            <Table className="tableUser">
              <thead>
                <tr className="tableHeadUserLogged text-uppercase">
                  <th>Título</th>
                  <th>Status</th>
                  <th>Data de criação</th>
                  <th>Data de publicação</th>
                  <th>Criador por</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className="align-middle ">
                <tr>
                  <td>
                    <div className="row">
                      <div className="col-auto">
                        <img alt="MyHistory" src={bookuserbooks}></img>
                      </div>
                      <div className="col-auto ">
                        <span>{book?.title}</span>
                        <br></br>
                        {
                          //@ts-ignore
                          <span>
                            {book?.updatedAt != null
                              ? `Última edição há ${differenceInDays(new Date(), book?.updatedAt)} dias`
                              : ""}{" "}
                          </span>
                        }
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <span className="border rounded-5  py-2 p-2 bgButtonStatus">
                      {plan?.title}
                    </span>
                  </td>
                  <td>
                    {new Date(
                      book?.createdAt != undefined
                        ? book?.createdAt
                        : new Date(),
                    ).toLocaleDateString("pt-BR")}
                  </td>
                  <td>-</td>
                  <td>
                    <span className="border rounded-5  py-2 p-2 bgButtonStatus">
                      {getInitialName(user?.firstname, user?.lastname)}
                    </span>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle as={CustomToggle} />
                      <Dropdown.Menu title="">
                        <Dropdown.Item onClick={() => handlerSelect()}>
                          Visualizar
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>

        {/* Mobile */}
        <div className="row m-2 d-block d-md-none ">
          <Card className="cardMobile">
            <Card.Body>
              <div className="row text-center">
                <div className="col-12 mt-2">
                  <img alt="MyHistory" src={bookuserbooks}></img>
                </div>
                <div className="col-12 mt-2 ">
                  <span className="fw-bold">{book?.title}</span>
                </div>
                <div className="col-12 mt-1">
                  {
                    //@ts-ignore
                    <small>
                      {book?.updatedAt != null
                        ? `Última edição há ${differenceInDays(new Date(), book?.updatedAt)} dias`
                        : ""}{" "}
                    </small>
                  }
                </div>
                <div className="col-12 mt-4">
                  <span className="border rounded-5  py-2 p-2 bgButtonStatus">
                    {plan?.title}
                  </span>
                </div>
                <div className="col-12 mt-4">
                  <span>Data de criação</span>
                </div>
                <div className="col-12 mt-0">
                  {new Date(
                    book?.createdAt != undefined ? book?.createdAt : new Date(),
                  ).toLocaleDateString("pt-BR")}
                </div>
                <div className="col-12 mt-4">
                  <span>Data de publicação</span>
                </div>
                <div className="col-12 mt-0">
                 --
                </div>
                <div className="col-12 mt-4">
                  <span>Criado por</span>
                </div>
                <div className="col-12 mt-1">
                    <span className="border rounded-5  py-2 p-2 bgButtonStatus">
                      {getInitialName(user?.firstname, user?.lastname)}
                    </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
export default BooksHistory