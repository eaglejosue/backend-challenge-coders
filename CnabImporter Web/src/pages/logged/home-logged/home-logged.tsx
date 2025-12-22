import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import { AuthenticatedUserModel } from "../../../common/models/authenticated.model";
import { BookService } from "../../../common/http/api/bookService";
import { BookModel } from "../../../common/models/book.model";
import { Modal as ModalResponsive } from "react-responsive-modal";
import { PlanService } from "../../../common/http/api/planService";
import { PlanModel } from "../../../common/models/plan.model";
import { ChapterModel } from "../../../common/models/chapter.model";
import { QuestionUserAnswerModel } from "../../../common/models/question-user-answer.model";
import { QuestionModel } from "../../../common/models/question.model";

import EmptyHomeLogged from "../../home/sections/empty-logged.section";
import BooksHistory from "../../home/sections/books-history-section";
import BookViewer from "../../../components/book-viewer/book-viewer";

import "./home-logged.scss";
import NavResponsive from "../../../components/nav/nav-responsive.component";
import paths from "../../../routes/paths";

const HomeLogged = () => {
  const navigate = useNavigate();

  const user = AuthenticatedUserModel.fromLocalStorage();
  const _bookService = new BookService();
  const _planService = new PlanService();
  const [book, setBook] = useState<BookModel>(new BookModel());
  const [plan, setPlan] = useState<PlanModel>(new PlanModel());
  const [questionUserAnswers, setQuestionUserAnswers] = useState<
    QuestionUserAnswerModel[]
  >([new QuestionUserAnswerModel()]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBookPreviewModalOpen, setIsBookPreviewModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    _bookService
      .getById(user?.lastBookId)
      .then((response: any) => {
        if (response) {
          setBook(response);
          getPlanChaptersQuestions(response.planId, user?.lastBookId);
        }
      })
      .catch((e: any) => {
        let message = "Error ao obter plano.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handlerSelect = () => {
    setIsBookPreviewModalOpen(true);
  };

  const getPlanChaptersQuestions = async (planId: number, bookId: number) => {
    setIsLoading(true);
    await _planService
      .getChaptersAndQuestionsByPlanIdAndBookId(planId, bookId)
      .then((response: any) => {
        setPlan(response);
        const allQuestionUserAnswers = response.chapters!.flatMap(
          (c: ChapterModel) =>
            c.questions!.flatMap((q: QuestionModel) => q.questionUserAnswers),
        );
        setQuestionUserAnswers(
          allQuestionUserAnswers ?? [new QuestionUserAnswerModel()],
        );
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

  return (
    <>
      <NavResponsive navItem="home" navItemLabel="Home" />
      <div className="container-fluid ">
        <div className="row">
          <main
            className="col-md-9 ms-sm-auto col-lg-11"
            style={{ marginTop: "70px" }}
          >
            <div className="p-3">
              <div className="row mb-4 pt-4">
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
                ) : book == null ? (
                  <EmptyHomeLogged user={user} />
                ) : (
                  <BooksHistory
                    book={book}
                    plan={plan}
                    user={user}
                    handlerSelect={handlerSelect}
                  />
                )}
              </div>
              <div className="row ">
                <div className="col-12">
                  <div className="row home-explore bg-white border rounded p-5">
                    <div className="col-12 mb-4 alignResponsive">
                      <h4>
                        <strong>Explore o IAutor</strong>
                      </h4>
                    </div>

                    <div className="col-md-5 explore-left p-5">
                      <span>
                        <strong>Saiba mais sobre o IAutor</strong>
                      </span>
                      <p className="mt-2">
                        Conheça nossa história, valores <br></br>e propósitos.
                      </p>
                      <Button
                        variant="btn-secondary"
                        className="rounded-5 f-14 p-3"
                        onClick={() => navigate(paths.ABOUT)}
                      >
                        <strong>Clique aqui</strong>
                      </Button>
                    </div>
                    <div className="col-2 "></div>
                    <div className="col-md-5  explore-right p-5 ">
                      <span>
                        <strong>FAQ</strong>
                      </span>
                      <p className="mt-2">
                        Encontre respostas rápidas para<br></br> suas dúvidas
                        mais comuns.
                      </p>
                      <Button
                        variant="btn-secondary"
                        className="rounded-5  f-14  p-3"
                        onClick={() => navigate(paths.FAQ)}
                      >
                        <strong>Clique aqui</strong>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
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
    </>
  );
};

export default HomeLogged;
