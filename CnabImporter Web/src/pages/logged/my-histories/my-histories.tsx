import React from "react";
import { useState, useEffect, FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Dropdown } from "react-bootstrap";
import { Modal as ModalResponsive } from "react-responsive-modal";
import { differenceInDays } from "date-fns";

import { myHistories } from "../../../assets/svg";
import { BookService } from "../../../common/http/api/bookService";
import { AuthenticatedUserModel } from "../../../common/models/authenticated.model";
import { BookModel } from "../../../common/models/book.model";
import { PlanModel } from "../../../common/models/plan.model";
import { ChapterModel } from "../../../common/models/chapter.model";
import { PlanService } from "../../../common/http/api/planService";
import { QuestionUserAnswerModel } from "../../../common/models/question-user-answer.model";
import { QuestionModel } from "../../../common/models/question.model";

import BookViewer from "../../../components/book-viewer/book-viewer";

import paths from "../../../routes/paths";
import "./my-histories.scss";
import NavResponsive from "../../../components/nav/nav-responsive.component";
import { BookFilter } from "../../../common/models/filters/book.filter";

const MyHistories = () => {
  const navigate = useNavigate();

  const _bookService = new BookService();
  const _planService = new PlanService();
  const user = AuthenticatedUserModel.fromLocalStorage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isBookPreviewModalOpen, setIsBookPreviewModalOpen] = useState(false);

  const [book, setBook] = useState<BookModel>(
    new BookModel({ title: "Alterar Título da História" }),
  );
  const [plan, setPlan] = useState<PlanModel>(new PlanModel());
  const [questionUserAnswers, setQuestionUserAnswers] = useState<
    QuestionUserAnswerModel[]
  >([new QuestionUserAnswerModel()]);

  useEffect(() => {
    if (!user) {
      navigate(paths.LOGIN);
      return;
    }

    setIsLoading(true);
    _bookService
      .getAll(
        new BookFilter({
          userId: user.id,
          includeUserBookPlan: true,
          paymentsApproved: true,
        }),
      )
      .then((response: any) => {
        if (response) {
          setBooks(response);
        }
      })
      .catch((e: any) => {
        let message = "Error ao obter livros.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handlerVisualizar = (book: BookModel) => {
    setBook(book);
    setPlan(book.plan);
    getPlanChaptersQuestions(book.planId, book.id);
  };

  // const handlerSelect = (e: any) => {
  //   console.log(e);
  // };

  const CustomToggle = React.forwardRef(({ children, onClick }: any, ref) => (
    <a
      href=""
      style={{ textDecoration: "none" }}
      //@ts-ignore
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <p className="threedots" />
    </a>
  ));

  const closeIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_693_22769"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_693_22769)">
        <path
          d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
          fill="white"
        />
      </g>
    </svg>
  );

  const getPlanChaptersQuestions = async (planId: number, bookId: number) => {
    setIsLoading(true);
    await _planService
      .getChaptersAndQuestionsByPlanIdAndBookId(planId, bookId)
      .then((response: any) => {
        const allQuestionUserAnswers = response.chapters!.flatMap(
          (c: ChapterModel) =>
            c.questions!.flatMap((q: QuestionModel) => q.questionUserAnswers),
        );
        setQuestionUserAnswers(
          allQuestionUserAnswers ?? [new QuestionUserAnswerModel()],
        );
        setIsBookPreviewModalOpen(true);
      })
      .catch((e: any) => {
        let message = "Error ao obter plano, capitulos e perguntas.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  interface ItemCardProps {
    book: BookModel;
  }

  const ItemCards: FunctionComponent<ItemCardProps> = (props) => {
    return (
      <div className="col-md-3 d-flex justify-content-center mb-2">
        <Card className="border-card">
          <Card.Body className="p-0">
            <div className="row m-1 pt-3">
              <div className="col-10">
                <span className="border rounded-5 text-secondary  py-2 p-2 bgButtonStatus">
                  {props.book?.plan?.title}
                </span>
              </div>
              <div className="col-2 text-end" style={{ marginTop: "-15px" }}>
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu>
                    <Dropdown.Item
                      title="Editar"
                      onClick={() =>
                        navigate(`${paths.NEW_HISTORY}/${props.book.id}`)
                      }
                    >
                      Editar
                    </Dropdown.Item>
                    <Dropdown.Item
                      disabled={true}
                      className="d-none d-md-block"
                      onClick={() => handlerVisualizar(props.book)}
                    >
                      Visualizar
                    </Dropdown.Item>
                    {/* <Dropdown.Item
                        disabled={true}
                        onClick={() => handlerSelect('Baixar')}
                      >
                        Visualizar PDF
                      </Dropdown.Item>
                      <Dropdown.Item
                        disabled={true}
                        onClick={() => handlerSelect('Deletar')}
                      >
                        Deletar
                      </Dropdown.Item> */}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="col-12">
                <br></br>
                <br></br>
              </div>
              <div className="col-12 colIcon  mt-3 alignResponsive">
                <img src={myHistories} alt="My-histories"></img>
              </div>
              <div className="col-12 mt-3 alignResponsive">
                {props.book.title}
              </div>
              <div className="col-12 alignResponsive text-muted">
                <small>
                  {props.book?.updatedAt != null
                    ? `Última edição há ${differenceInDays(new Date(), props.book?.updatedAt)} dias`
                    : ""}
                </small>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <>
      <NavResponsive navItem="my-histories" navItemLabel="Minha Histórias" />
      <div className="container-fluid ">
        <div className="row">
          <main
            className="col-md-9 ms-sm-auto
                      col-lg-11  "
            style={{ marginTop: "70px" }}
          >
            <div className="p-0">
              {/* conteudo */}
              <div className="row mt-4">
                <div className="col-md-8 gx-0 alignResponsive">
                  <h4>
                    <strong>Minhas histórias </strong>
                  </h4>
                  <p>
                    <strong>
                      {"".padStart(books?.length > 9 ? 0 : 1, "0") +
                        books?.length.toString()}
                    </strong>{" "}
                    História(s) criada(s) até o momento
                  </p>
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
                <div className="col-md-2 text-end  gap-2 d-grid d-md-none ">
                  <Button
                    variant=" btn-secondary"
                    onClick={() => navigate(paths.PRICING_PLANS)}
                    className=" rounded-5  f-14  p-3 historyLoggedButton"
                  >
                    <strong>Criar história</strong>
                  </Button>
                </div>
              </div>
              <div className="row mt-2 alignResponsive">
                <div className="col-md-1 gx-0 text-primary alignResponsive">
                  <strong>Histórias</strong>
                  <hr></hr>
                </div>
                <div className="col-11 gx-0 d-none d-md-block">
                  &nbsp;
                  <hr></hr>
                </div>
              </div>
              <div className="row mt-4">
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
                  books?.map((b: BookModel) => {
                    return ItemCards({ book: b });
                  })
                )}
              </div>
            </div>
          </main>
        </div>

        <ModalResponsive
          open={isBookPreviewModalOpen}
          closeIcon={closeIcon}
          center
          classNames={{ overlay: "customOverlay", modal: "customModal" }}
          onClose={() => setIsBookPreviewModalOpen(false)}
        >
          <BookViewer
            book={book}
            plan={plan}
            questionUserAnswers={questionUserAnswers}
          />
        </ModalResponsive>
      </div>
    </>
  );
};

export default MyHistories;
