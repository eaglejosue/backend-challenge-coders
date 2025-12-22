import { PlanItens, PlanModel } from "../../../common/models/plan.model";
import { useNavigate } from "react-router-dom";
import { FunctionComponent, useEffect, useState } from "react";
import { PlanFilter } from "../../../common/models/filters/plan.filter";
import { PlanService } from "../../../common/http/api/planService";

import paths from "../../../routes/paths";
import "../../home/home.scss";
import "./pricing-plans.scss";
import NavResponsive from "../../../components/nav/nav-responsive.component";

// import { AuthenticatedUserModel } from "../../../common/models/authenticated.model";
// import { BookService } from "../../../common/http/api/bookService";
// import { BookFilter } from "../../../common/models/filters/book.filter";
// import { BookModel } from "../../../common/models/book.model";

const PricingPlans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<PlanModel[]>([]);
  const _planService = new PlanService();
  const [isLoading, setIsloading] = useState(false);

  //const _bookService = new BookService();
  // const [book, setBook] = useState<BookModel>(
  //   new BookModel({ title: "Alterar Título da História" }),
  // );

  useEffect(() => {
    //@ts-ignore
    getPlans({ isActive: true });

    // const user = AuthenticatedUserModel.fromLocalStorage()!;
    // if (user) {
    //   getBook(user.lastBookId, user);
    // }
  }, []);

  const getPlans = (filter?: PlanFilter) => {
    setIsloading(true);
    _planService
      .getAll(filter ?? new PlanFilter())
      .then((response: any) => {
        setPlans(response?.length ? response : []);
      })
      .catch((e: any) => {
        let message = "Error ao obter planos.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  // const getBook = (id: number, user: AuthenticatedUserModel) => {
  //   setIsloading(true);
  //   _bookService
  //     .getAll(new BookFilter({ id, userId: user.id }))
  //     .then((response: any) => {
  //       if (!response.length) {
  //         return;
  //       }

  //       const book = response[0];
  //       setBook(book);
  //     })
  //     .catch((e: any) => {
  //       let message = "Error ao obter livro.";
  //       if (e.response?.data?.length > 0 && e.response.data[0].message)
  //         message = e.response.data[0].message;
  //       if (e.response?.data?.detail) message = e.response?.data?.detail;
  //       console.log("Erro: ", message, e);
  //     })
  //     .finally(() => {
  //       setIsloading(false);
  //     });
  // };

  const PacotesSection: FunctionComponent = () => {
    return (
      <>
        <div className="row">
          {plans?.map((plan: PlanModel, i: number) => {
            return (
              <div key={i.toString()} className="col-sm-12 col-lg-4 mt-2">
                <div
                  className={`card ${i === 1 ? "bg-primary text-white" : ""}`}
                  style={{ minHeight: "500px" }}
                >
                  <div className="card-body text-start">
                    <h5 className="m-2">
                      <strong>{plan.title}</strong>
                    </h5>
                    <div className="row ">
                      <div className="col-12 m-2">
                        <h1>
                          <strong>
                            {plan.currency} {plan.price}
                          </strong>{" "}
                          <small className="fs-6"></small>
                        </h1>
                      </div>
                    </div>
                    <p className="mb-5 m-2">{plan.description}</p>
                    <hr />
                    <ul className="mt-5 mb-4 f-14">
                      {plan.planItems?.map((r: PlanItens, i: number) => {
                        return (
                          <li key={i.toString()} className="fw-bold">
                            {r.description}
                          </li>
                        );
                      })}
                    </ul>
                    <hr />
                    <div className="row text-center">
                      <div className="d-flex justify-content-center pt-3">
                        <button
                          //disabled={book?.planId == plan.id}
                          disabled={plan.price === 0}
                          className={`btn ${i == 1 ? "bg-white text-black btnComprarBlack" : "bg-secondary text-white btnComprarRed"} rounded-5 f-13 py-3 mb-4 w-70 `}
                          style={{
                            fontWeight: "bold",
                            position: "absolute",
                            bottom: "0px",
                          }}
                          onClick={() => {
                            navigate(`${paths.PAYMENT_TERMS}/${plan.id}`);
                          }}
                        >
                          Comprar agora
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <NavResponsive navItem="pricing" navItemLabel="Pacotes e Preços" />
      <div className="container-fluid ">
        <div className="row">
          <main
            className="col-md-9 ms-sm-auto col-lg-11"
            style={{ marginTop: "70px" }}
          >
            <div className="pt-0">
              {/* conteudo */}
              <div className="row ">
                <div className="col-12 alignResponsive mt-3">
                  <h4>
                    <strong>Pacotes e preços </strong>
                  </h4>
                  <p>
                    Conheça os nossos pacotes para atender suas necessidades
                    específicas.
                  </p>
                </div>
              </div>
              {isLoading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100%", borderRadius: "9px" }}
                >
                  <div
                    className="spinner-border text-primary"
                    style={{ width: "3rem", height: "3rem" }}
                    role="status"
                  />
                </div>
              ) : (
                <PacotesSection />
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
export default PricingPlans;
