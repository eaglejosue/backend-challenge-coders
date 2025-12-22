/* eslint-disable no-debugger */
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { Modal, ModalHeader, Nav, Offcanvas, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import Dropdown from "react-bootstrap/Dropdown";
import { Modal as ModalResponsive } from "react-responsive-modal";

import NavUserOptions from "../../../components/nav/nav-user-options.component";
import BookViewer from "../../../components/book-viewer/book-viewer";
import UploadPhotosContainer from "./photos/upload-photos.container";

import { UserService } from "../../../common/http/api/userService";
import { BookService } from "../../../common/http/api/bookService";
import { PlanService } from "../../../common/http/api/planService";
import { QuestionService } from "../../../common/http/api/questionService";
import { IAService } from "../../../common/http/api/iaService";

import { AuthenticatedUserModel } from "../../../common/models/authenticated.model";
import { BookFilter } from "../../../common/models/filters/book.filter";
import { BookModel } from "../../../common/models/book.model";
import { PlanModel } from "../../../common/models/plan.model";
import { ChapterModel } from "../../../common/models/chapter.model";
import { QuestionModel } from "../../../common/models/question.model";
import { QuestionUserAnswerModel } from "../../../common/models/question-user-answer.model";

import paths from "../../../routes/paths";
import horizontalImgs from "../../../assets/horizontal-imgs";
import previewCapaLivro from "../../../assets/img/preview-capa-livro.png";
import previewCapaLivroBranca from "../../../assets/img/Preview-capa-livro-branca.png";
import artificialInteligence from "../../../assets/svg/artificial-inteligence.svg";
import openBook from "../../../assets/svg/open-book.svg";
import life from "../../../assets/svg/life.svg";
import clownWithHat from "../../../assets/svg/face-of-clown-with-hat.svg";
import theater from "../../../assets/svg/theater.svg";
import hearts from "../../../assets/svg/hearts.svg";
import WomanIsTyping from "../../../assets/img/woman-is-typing-laptop-with-lamp-her.png";
import Logo from "../../../assets/img/favicon-32x32.png";
import "./new-history.scss";
import React from "react";
import { help } from "../../../assets/img";

const NewHistory = () => {
  const navigate = useNavigate();
  const param = useParams();

  const _userService = new UserService();
  const _bookService = new BookService();
  const _planService = new PlanService();
  const _questionService = new QuestionService();
  const _iaService = new IAService();

  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const isLoading = isLoading1 || isLoading2;

  const [isLoadingSaveAnswer, setIsLoadingSaveAnswer] =
    useState<boolean>(false);
  const [imgRandomSrc, setImgRandomSrc] = useState("1");

  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);

  const [book, setBook] = useState<BookModel>(
    new BookModel({ title: "Alterar Título da História" }),
  );
  const [plan, setPlan] = useState<PlanModel>(new PlanModel());
  const [chapter, setChapter] = useState(new ChapterModel());
  const [question, setQuestion] = useState(new QuestionModel());

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("Alterar Título da História");
  const [theme, setTheme] = useState("");

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsTextModal, setTermsTextModal] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isIAModalOpen, setIsIAModalOpen] = useState(false);
  const [isBookPreviewModalOpen, setIsBookPreviewModalOpen] = useState(false);
  const [isPhotoUploadModalOpen, setIsPhotoUploadModalOpen] = useState(false);
  const [isFinalizeBookModalOpen, setIsFinalizeBookModalOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [questionUserAnswers, setQuestionUserAnswers] = useState<
    QuestionUserAnswerModel[]
  >([new QuestionUserAnswerModel()]);

  const [answer, setAnswer] = useState("");
  const [answerChanged, setAnswerChanged] = useState<boolean>(false);
  const [qtdCallIASugestionsUsed, setQtdCallIASugestionsUsed] = useState(0);
  const [IAText, setIAText] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [user, setUser] = useState<AuthenticatedUserModel>();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 16); // Gera um número entre 0 e 15
    setImgRandomSrc(horizontalImgs[randomIndex]);

    const user = AuthenticatedUserModel.fromLocalStorage()!;
    if (user && user.token?.length) setUser(user);

    if (user.termsAccepted) {
      getBook(parseInt(param.id!));
    } else {
      setTermsTextModal(1);
      setIsTermsModalOpen(true);
    }
  }, []);

  const logout = () => {
    AuthenticatedUserModel.removeLocalStorage();
    navigate(paths.LOGIN);
  };

  const handleAcceptTerms = () => {
    if (!acceptedTerms) {
      setErrorMessage(
        "Antes de prosseguir, por favor, confirme que leu e concorda com nossos termos e condições.",
      );
    } else {
      setErrorMessage("");
      saveUserAcceptedTerms();
    }
  };

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
    </a>
  ));

  const saveUserAcceptedTerms = async () => {
    setIsLoading2(true);
    const user = AuthenticatedUserModel.fromLocalStorage()!;
    await _userService
      .saveUserAcceptedTerms(user.id)
      .then(() => {
        setIsTermsModalOpen(false);
        getBook(parseInt(param.id!));
        user.termsAccepted = true;
        AuthenticatedUserModel.saveToLocalStorage(user);
      })
      .catch((e: any) => {
        let message = "Error ao salvar aceite de termos pelo usuário.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsLoading2(false);
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

  const getBook = (id: number) => {
    setIsLoading1(true);
    const user = AuthenticatedUserModel.fromLocalStorage()!;
    _bookService
      .getAll(new BookFilter({ id, userId: user.id }))
      .then((response: any) => {
        if (!response.length) {
          navigate(paths.HOME_LOGGED);
          return;
        }

        const book = response[0];
        setBook(book);
        setTitle(book.title);
        getPlanChaptersQuestions(book.planId, id);
      })
      .catch((e: any) => {
        let message = "Error ao obter livro.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsLoading1(false);
      });
  };

  const saveBook = () => {
    _bookService
      .put(new BookModel({ ...book, title: title }))
      .then(() => {
        navigate(paths.HOME_LOGGED);
      })
      .catch((e: any) => {
        let message = "Error ao salvar livro.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {});
  };

  const getPlanChaptersQuestions = async (planId: number, bookId: number) => {
    setIsLoading2(true);
    await _planService
      .getChaptersAndQuestionsByPlanIdAndBookId(planId, bookId)
      .then((response: any) => {
        setPlan(response);
        setChapter(response.chapters[0]);
        setIsFirstQuestion(true);
        const questionRes = response.chapters[0].questions[0];
        setQuestion(questionRes);
        setQuestionIndex(0);
        setAnswer(questionRes.questionUserAnswers[0]?.answer ?? "");
        setQtdCallIASugestionsUsed(
          questionRes.questionUserAnswers[0]?.qtdCallIASugestionsUsed ?? 0,
        );

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
        setIsLoading2(false);
      });
  };

  const handleQuestionUserAnswer = (questionId: number, chapterId: number) => {
    const questionUserAnswer = questionUserAnswers?.find(
      (f) => f.questionId == questionId && f.chapterId == chapterId,
    );
    setAnswer(questionUserAnswer?.answer ?? "");
    setQtdCallIASugestionsUsed(
      questionUserAnswer?.qtdCallIASugestionsUsed ?? 0,
    );
  };

  const handleIASuggestionClick = () => {
    if (answer.length == 0) {
      toast.error("Digite sua resposta para consultar!", {
        position: "top-center",
        style: { width: 450 },
      });
      return;
    }

    if (answer.length < question.minLimitCharacters) {
      toast.error(
        `Resposta deve conter no mínimo ${question.minLimitCharacters} caracteres!`,
        {
          position: "top-center",
          style: { width: 450 },
        },
      );
      return;
    }

    if (qtdCallIASugestionsUsed === plan.maxQtdCallIASugestions) {
      toast.error("Você não possui mais sugestões de texto do IAutor!", {
        position: "top-center",
        style: { width: 450 },
      });
      return;
    }

    setIsIAModalOpen(true);
    setIAText("");
    postIASugestion();
  };

  const postIASugestion = async () => {
    setIsLoading1(true);
    await _iaService
      .post({
        question: question.title,
        questionAnswer: answer,
        theme,
        maxCaracters: question.maxLimitCharacters,
      })
      .then((response: any) => {
        setIAText(response.text);
        const qtd = qtdCallIASugestionsUsed + 1;
        setQtdCallIASugestionsUsed(qtd);
        saveQuestionAnswer(undefined, qtd, false);
      })
      .catch((e) => {
        let message = "Error ao obter dados de participante.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsLoading1(false);
      });
  };

  const handleIAAccept = () => {
    setIsIAModalOpen(false);
    setAnswer(IAText);
    saveQuestionAnswer(IAText);
  };

  const handleChapterClick = (id: number, fromBeforeClick: boolean = false) => {
    setAnswerChanged(false);

    const chapterC = plan.chapters!.find((f) => f.id == id);
    setChapter(chapterC!);

    const questionsLength = chapterC!.questions!.length;
    const questionC = fromBeforeClick
      ? chapterC!.questions![questionsLength - 1]
      : chapterC!.questions![0];
    setQuestion(questionC);
    const questionCIndex = fromBeforeClick ? questionsLength - 1 : 0;
    setQuestionIndex(questionCIndex);
    handleQuestionUserAnswer(questionC.id, chapterC!.id);

    const chapterIndex = plan.chapters!.findIndex((f) => f.id == id);
    setIsFirstQuestion(chapterIndex == 0 && questionCIndex == 0);
  };

  const handleBeforeQuestionClick = () => {
    setIsLastQuestion(false);
    setAnswerChanged(false);

    const isFirstQuestionB = questionIndex == 0;
    const chapterIndex = plan.chapters!.findIndex((f) => f.id == chapter.id);
    const isFirstChapter = chapterIndex == 0;

    if (isFirstQuestionB && isFirstChapter) {
      setIsFirstQuestion(true);
      return;
    }

    if (isFirstQuestionB) {
      handleChapterClick(plan.chapters![chapterIndex - 1].id, true);
      return;
    }

    const questionB = chapter.questions![questionIndex - 1];
    setQuestion(questionB);
    setQuestionIndex(questionIndex - 1);
    handleQuestionUserAnswer(questionB.id, chapter.id);
  };

  const handlerFocus = (e: any) => {
    const temp_value = e.target.value;
    e.target.value = "";
    e.target.value = temp_value;
  };

  const handlerChangeIaText = (e: any) => {
    e.preventDefault();
    setIAText(e.target.value);
  };

  const handleNextQuestionClick = () => {
    if (answerChanged) {
      saveQuestionAnswer();
    }

    setIsFirstQuestion(false);
    setAnswerChanged(false);

    const isLastQuestionN = questionIndex + 1 == chapter.questions!.length;
    const chapterIndex = plan.chapters!.findIndex((f) => f.id == chapter.id);
    const isLastChapter = chapterIndex + 1 == plan.chapters!.length;

    if (isLastQuestionN && isLastChapter) {
      setIsLastQuestion(true);
      //finalizado
      return;
    }

    if (isLastQuestionN) {
      handleChapterClick(plan.chapters![chapterIndex + 1].id);
      return;
    }

    const questionN = chapter.questions![questionIndex + 1];
    setQuestion(questionN);
    setQuestionIndex(questionIndex + 1);
    handleQuestionUserAnswer(questionN.id, chapter.id);
  };

  useEffect(() => {
    if (!answerChanged) return; // Não faz nada se `answerChanged` for falso.

    const handler = setTimeout(() => {
      saveQuestionAnswer(undefined, undefined, true);
      setAnswerChanged(false); // Marca como salvo.
    }, 10000); // Aguarda 10 segundos após a última digitação.

    // Limpa o temporizador se o usuário continuar digitando.
    return () => clearTimeout(handler);
  }, [answerChanged, answer]);

  const saveQuestionAnswer = async (
    txt?: string,
    qtd?: number,
    fromAutomatic: boolean = false,
  ) => {
    if (answer.length == 0) {
      if (!fromAutomatic) {
        toast.error("Digite sua resposta para consultar!", {
          position: "top-center",
          style: { width: 450 },
        });
      }
      return;
    }

    if (answer.length < question.minLimitCharacters) {
      if (!fromAutomatic) {
        toast.error(
          `Resposta deve conter no mínimo ${question.minLimitCharacters} caracteres!`,
          {
            position: "top-center",
            style: { width: 450 },
          },
        );
      }
      return;
    }

    const newQuestionUserAnswerModel = new QuestionUserAnswerModel({
      questionId: question.id,
      chapterId: chapter.id,
      userId: book.userId,
      bookId: book.id,
      answer: txt ?? answer,
      qtdCallIASugestionsUsed: qtd ?? qtdCallIASugestionsUsed,
    });

    setIsLoadingSaveAnswer(true);
    await _questionService
      .upsertQuestionUserAnswer(newQuestionUserAnswerModel)
      .then((response: any) => {
        const questionUserAnswersFiltered = questionUserAnswers?.filter(
          (f) => f.id != response.id,
        );
        setQuestionUserAnswers([...questionUserAnswersFiltered, response]);
      })
      .catch((e) => {
        let message = "Error ao obter dados de participante.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsLoadingSaveAnswer(false);
      });
  };

  const bookPDF = async () => {
    setIsLoadingPDF(true);
    await _bookService
      .getBookPDF(book.id)
      .then((response: any) => {
        // Decodifica o byteArray de Base64
        const byteCharacters = atob(response.byteArray);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        // Cria o Blob e URL
        const url = window.URL.createObjectURL(
          new Blob([byteArray], { type: response.mimeType }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", response.fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((e) => {
        let message = "Error ao obter dados de participante.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsLoadingPDF(false);
      });
  };

  const handleClosePhotoUploadModal = (
    questionUserAnswer: QuestionUserAnswerModel,
  ) => {
    const questionUserAnswersTemp = questionUserAnswers?.filter(
      (f) => f.id != questionUserAnswer.id,
    );
    setQuestionUserAnswers([...questionUserAnswersTemp, questionUserAnswer]);
    const questionTemp = new QuestionModel({
      ...question,
      questionUserAnswers: [questionUserAnswer],
    });
    setQuestion(questionTemp);
    setIsPhotoUploadModalOpen(false);
  };

  const handleFinalizeClick = () => {
    const chapterQuestionsList = plan.chapters!.flatMap((chapter) =>
      chapter!.questions!.map((question) => ({
        chapterId: chapter.id,
        questionId: question.id,
      })),
    );

    const questionUserAnswersList = questionUserAnswers.map((m) => ({
      chapterId: m.chapterId,
      questionId: m.questionId,
    }));

    const chapterQuestionsSet = new Set(
      chapterQuestionsList.map(
        (chapterQuestion) =>
          `${chapterQuestion.chapterId}-${chapterQuestion.questionId}`,
      ),
    );

    const allExist =
      questionUserAnswersList.length > 0 &&
      questionUserAnswersList.every((userAnswer) =>
        chapterQuestionsSet.has(
          `${userAnswer.chapterId}-${userAnswer.questionId}`,
        ),
      );

    if (!allExist) {
      setIsFinalizeBookModalOpen(true);
    }

    finalizeBook();
  };

  const finalizeBook = () => {
    //Change book Status
  };
  interface PropsSideMenu {
    navItem: string;
    navItemLabel: string;
  }

  const SideMenu: FunctionComponent<PropsSideMenu> = (p) => {
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
            onClick={() => handleShow()}
            aria-controls="sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <span className="d-block d-md-none" style={{ flex: "auto" }}>
            <span className=" fw-bold f-18 pe-0">IAutor</span>
            <span className=" f-18 ps-1"> / {p.navItemLabel}</span>
            <span
              className="material-symbols-outlined px-3"
              style={{ fontSize: "18px", color: "#DB3737", cursor: "pointer" }}
              onClick={() => {
                setIsEditingTitle(true);
              }}
            >
              edit
            </span>
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                maxLength={50}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                onBlur={() => {
                  setIsEditingTitle(false);
                  saveBook();
                }}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setIsEditingTitle(false);
                  saveBook();
                }}
                autoFocus
                className="form-control"
                style={{ width: "100%" }}
              />
            ) : (
              <div>{title}</div>
            )}
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
            <span className=" float-start px-4 " style={{ display: "flex" }}>
              <span className=" fw-bold f-18 pe-0">IAutor</span>
              <span className=" f-18 ps-1"> / {p.navItemLabel}</span>

              <span
                className="material-symbols-outlined px-3"
                style={{
                  fontSize: "18px",
                  color: "#DB3737",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsEditingTitle(true);
                }}
              >
                edit
              </span>
              <span>
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={title}
                    maxLength={50}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    onBlur={() => {
                      setIsEditingTitle(false);
                      saveBook();
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      setIsEditingTitle(false);
                      saveBook();
                    }}
                    autoFocus
                    className="form-control"
                    style={{ width: "350px" }}
                  />
                ) : (
                  <div>{title}</div>
                )}
              </span>
            </span>
            <span className=" float-start px-5 " style={{ display: "flex" }}>
              <div className="row align-items-center">
                <div className="col-auto">
                  <b className="bg-pink text-primary rounded-5 f-12 px-4 py-1">
                    Criação
                  </b>
                </div>
                <div className="col-auto f-12">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    style={{ color: "#7F7F8B" }}
                  />
                </div>
                <div className="col-auto">
                  <a
                    className="btn bg-secondary text-white rounded-5 f-12 px-4 py-1"
                    style={{ fontWeight: "bold" }}
                    onClick={() => {
                      handleFinalizeClick();
                    }}
                  >
                    Finalizar
                  </a>
                </div>
              </div>
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
                    onClick={() => {
                      navigate(paths.MY_ACCOUNT);
                    }}
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
                    onClick={() => {
                      navigate(paths.MY_ACCOUNT);
                      handleClose();
                    }}
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
                      onClick={() => {
                        navigate(paths.HOME_LOGGED);
                        handleClose();
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-white "
                        style={{ fontSize: "32px", color: "black" }}
                      >
                        cottage
                      </span>
                      <span className="p-4 ">Home</span>
                    </a>
                  </li>
                  <li className="mb-3">
                    {" "}
                    <a
                      href="#"
                      className="nav-link text-white"
                      onClick={() => {
                        navigate(`${paths.NEW_HISTORY}/${user?.lastBookId}`);
                        handleClose();
                      }}
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
                      onClick={() => {
                        navigate(paths.MY_HISTORIES);
                        handleClose();
                      }}
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
                      onClick={() => {
                        navigate(paths.PRICING_PLANS);
                        handleClose();
                      }}
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
                      onClick={() => {
                        logout();
                        handleClose();
                      }}
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

  const CapitulosSection: FunctionComponent = () => {
    return (
      <>
        <div className="col-md-3 border-end paddingResponsive">
          <div className="d-flex align-items-center justify-content-between border-bottom px-4 pb-4">
            <b className="f-16 d-none d-md-block">Capítulos</b>
            <div
              className="text-primary fw-bold rounded-5 f-10 px-4 py-1 d-none d-md-block"
              style={{ border: "1px solid #db3737" }}
            >
              {plan.chapters?.length} Capítulo
              {(plan.chapters?.length ?? 1) > 1 ? "s" : ""}
            </div>
            <div className="clearfix w-100 d-block d-md-none ">
              <div
                className="text-primary fw-bold rounded-5 f-10 px-4 py-1 mt-3 float-end "
                style={{ border: "1px solid #db3737" }}
              >
                {plan.chapters?.length} Capítulo
                {(plan.chapters?.length ?? 1) > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {isLoading2 && (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "20%", borderRadius: "9px" }}
            >
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              />
            </div>
          )}

          {/* Capítulos */}
          {plan.chapters?.map((c, index) => {
            return (
              <div
                key={index}
                className={`border-bottom p-3  ${chapter.id === c.id ? "bg-iautor-color" : "bg-white"}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleChapterClick(c.id);
                }}
              >
                <div className="f-10">Capítulo {c.chapterNumber}</div>
                <b className="f-13">{c.title}</b>
                <div className="d-flex align-items-center justify-content-between text-icon f-10">
                  <div className="d-flex">
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "12px",
                        color: "red",
                        marginRight: "3px",
                      }}
                    >
                      quiz
                    </span>
                    {c.questions?.length} Pergunta
                    {(c.questions?.length ?? 1) > 1 ? "s" : ""}
                  </div>
                  {c.questions?.length &&
                    (questionUserAnswers?.filter(
                      (answer) => answer.chapterId === c.id,
                    ).length === c.questions.length ? (
                      <div className="d-flex">
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "12px",
                            color: "green",
                            marginRight: "3px",
                          }}
                        >
                          check_circle
                        </span>
                        Respondido
                      </div>
                    ) : (
                      <div className="d-flex">
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "12px",
                            color: "red",
                            marginRight: "3px",
                          }}
                        >
                          pending
                        </span>
                        Pendente
                      </div>
                    ))}
                </div>
              </div>
            );
          })}

          {/* Img baixo */}
          <div id="img-baixo" className="pb-2 mt-5 d-none d-md-block">
            <div className="d-flex justify-content-center">
              <img
                src={imgRandomSrc}
                style={{
                  minWidth: "314px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            </div>
            <div className="d-flex justify-content-center mt-2 p-2">
              <b className="f-16">Uma História mais Completa</b>
            </div>
            <div className="d-flex text-center f-14 px-4">
              Formate a escrita, edite a capa e crie histórias com mais detalhes
              e momentos.
            </div>
            {plan && plan.title && plan.price == 0 && (
              <div className="d-flex justify-content-center p-4">
                <div
                  className="btn bg-secondary text-white rounded-5 f-12 px-4 py-2 w-50"
                  style={{ fontWeight: "bold" }}
                  onClick={() => navigate(paths.PRICING_PLANS)}
                >
                  Ver Planos
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const PreviewSection: FunctionComponent = () => {
    return (
      <>
        <div
          className="d-none d-md-flex bg-white justify-content-center px-4 py-3"
          style={{ borderBottom: "2px solid #db3737" }}
        >
          <div className="f-14 ">
            <br></br>&nbsp;Preview
          </div>
        </div>

        <div
          className="d-flex justify-content-center align-items-center bg-white shadow rounded-3 marginFerramentasEdicao
                   my-4 p-4 "
        >
          <div className="d-flex f-14">Ferramentas de Edição</div>
          <div className="d-flex text-icon ps-4">
            <span
              className="material-symbols-outlined text-primary px-2 "
              style={{ fontSize: "24px", cursor: "pointer" }}
              onClick={() => setIsBookPreviewModalOpen(true)}
              title="Visualizar livro"
            >
              auto_stories
            </span>
            <span
              className="material-symbols-outlined text-primary px-2"
              style={{ fontSize: "24px", cursor: "pointer" }}
              onClick={() => setIsPhotoUploadModalOpen(true)}
              title="Inserir/Alterar foto"
            >
              add_photo_alternate
            </span>

            {isLoadingPDF ? (
              <span
                className="spinner-border spinner-border-sm text-primary mt-1 mx-2"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <span
                className="material-symbols-outlined text-primary px-2"
                style={{ fontSize: "24px", cursor: "pointer" }}
                onClick={bookPDF}
                title="Visualizar PDF"
              >
                file_save
              </span>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-center pb-4 ">
          {answer.length == 0 ? (
            <img src={previewCapaLivro} />
          ) : (
            <img src={previewCapaLivroBranca} />
          )}
          {answer.length > 0 && (
            <>
              <div
                id="chapter"
                className="d-flex position-absolute text-center f-11"
                style={{
                  fontFamily: "Times New Roman",
                  marginTop: "6vh",
                }}
              >
                Capítulo {chapter.chapterNumber}
              </div>
              
              <div
                id="title"
                className="d-flex position-absolute text-center f-18"
                style={{
                  fontFamily: "Times New Roman",
                  marginTop: "8vh",
                }}
              >
                {question.subject.length>40 ?  <b>{question.subject.substring(0,40)}<br></br> {question.subject.substring(40,question.subject.length)}</b>:<b>{question.subject}</b> }
              </div>

              {question.questionUserAnswers &&
                question.questionUserAnswers[0]?.imagePhotoUrl && (
                  <div
                    id="img"
                    className="d-flex position-absolute text-center "
                    style={{ marginTop: question.subject.length>40? "14vh":"12vh" }}
                  >
                    <button
                      className="btn  p-0 my-2 border-0 bg-transparent"
                      type="button"
                      onClick={() => setIsPhotoUploadModalOpen(true)}
                      style={{
                        outline: "none",
                        position: "relative",
                      }}
                    >
                      <div
                        className="rounded-circle bg-light d-flex justify-content-center align-items-center"
                        style={{
                          width: "220px",
                          position: "relative",
                        }}
                      >
                        {question.questionUserAnswers[0]?.imagePhotoUrl ? (
                          <img
                            src={question.questionUserAnswers[0]?.imagePhotoUrl}
                            alt="Participante"
                            className="img-fluid img-thumbnail "
                            style={{
                              maxHeight: "155px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: "45px",
                              color: "#6c63ff",
                            }}
                          >
                            person
                          </span>
                        )}
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center bg-body-bg rounded-circle"
                        style={{
                          width: "24px",
                          height: "24px",
                          position: "absolute",
                          bottom: "5px",
                          right: "5px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "16px",
                            color: "#DB3737",
                          }}
                        >
                          edit
                        </span>
                      </div>
                    </button>
                  </div>
                )}

              <div
                className="d-flex position-absolute f-13"
                style={{
                  fontFamily: "Times New Roman",
                  lineHeight: "16px",
                  marginTop:
                    question.questionUserAnswers &&
                    question.questionUserAnswers[0]?.imagePhotoUrl == null
                      ? question.subject.length>40? "14vh":   "12vh"
                      : "36vh",
                  marginLeft: "9%",
                  marginRight: "9%",
                }}
              >
                {answer.substring(
                  0,
                  question.questionUserAnswers &&
                    question.questionUserAnswers[0]?.imagePhotoUrl == null
                    ? 1400
                    : 900,
                )}
              </div>
            </>
          )}
        </div>
      </>
    );
  };
  return (
    <>
      <SideMenu navItem="book" navItemLabel="Criar História" />
      <div className="container-fluid ">
        <div className="row">
          <main
            className="col-md-9 col-lg-12 marginLeftContainer "
            style={{ marginTop: "70px" }}
          >
            <div className="pt-0">
              {/* conteudo Desktop */}
              <div className="row d-none d-md-flex">
                {/* 1 - Capítulos */}
                <CapitulosSection />

                {/* 2 - Perguntas */}
                <div className="col-md-4 border-end p-0">
                  <div className=" align-items-center border-bottom px-4 py-3 d-none d-md-flex">
                    <div
                      className="d-flex bg-primary align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "100%",
                        marginRight: "15px",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "16px", color: "white" }}
                      >
                        quiz
                      </span>
                    </div>
                    <div className="f-14 ">
                      <b>Perguntas</b>
                      <div>
                        Responda as perguntas abaixo para criar sua história
                      </div>
                    </div>
                  </div>

                  {/* Contador de perguntas */}
                  {isLoading ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "20%", borderRadius: "9px" }}
                    >
                      <div
                        className="spinner-border text-primary"
                        style={{ width: "3rem", height: "3rem" }}
                        role="status"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="d-flex align-items-center justify-content-between paddingResponsivePerguntasHeader ">
                        <div>
                          <div className="f-14">
                            Capítulo {chapter.chapterNumber}
                          </div>
                          <b className="f-16">{chapter.title}</b>
                        </div>
                        <div
                          className="text-primary fw-bold rounded-5 f-10 px-4 py-1"
                          style={{ border: "1px solid #db3737" }}
                        >
                          Pergunta {questionIndex + 1}/
                          {chapter.questions?.length}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between paddingResponsivePerguntas ">
                        <div>
                          <span className="text-primary">
                            {questionIndex + 1} -{" "}
                          </span>
                          {question.title}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Área resposta */}
                  <div className="d-flex paddingResponsivePerguntasBody ">
                    <TextareaAutosize
                      autoFocus
                      onFocus={(e) => handlerFocus(e)}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                        setAnswerChanged(true);
                      }}
                      value={answer}
                      disabled={isLoading}
                      placeholder="Digite sua resposta aqui..."
                      style={{
                        width: "100%",
                        minHeight: "300px",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #757575",
                      }}
                      minLength={question.minLimitCharacters}
                      maxLength={question.maxLimitCharacters}
                    />
                  </div>

                  {/* Limite caracter, temas e botão IA - DESKTOP */}
                  <div className="d-none d-md-flex align-items-center justify-content-between px-5 py-3">
                    <span className="text-muted f-14">
                      {answer.length} / {question.maxLimitCharacters}
                    </span>

                    <div className="d-flex justify-content-center">
                      <div
                        className="d-flex btn bg-pink text-primary align-items-center justify-content-center rounded-5 me-4"
                        style={{
                          width: "32px",
                          height: "32px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setIsHelpModalOpen(true);
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "16px" }}
                        >
                          help
                        </span>
                      </div>

                      <Dropdown drop="up">
                        <Dropdown.Toggle
                          className="btn bg-pink text-primary d-flex align-items-center justify-content-center rounded-5"
                          style={{ width: "68px", height: "32px" }}
                          id="dropdown-basic"
                        >
                          {theme === "Tradicional" ? (
                            <img
                              className="me-2"
                              src={openBook}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : theme === "Bibliográfico" ? (
                            <img
                              className="me-2"
                              src={life}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : theme === "Cômico" ? (
                            <img
                              className="me-2"
                              src={clownWithHat}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : theme === "Dramático" ? (
                            <img
                              className="me-2"
                              src={theater}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : theme === "Romântico" ? (
                            <img
                              className="me-2"
                              src={hearts}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : (
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "16px" }}
                            >
                              mood
                            </span>
                          )}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="f-14">
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Tradicional")}
                          >
                            <img
                              className="me-2"
                              src={openBook}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Tradicional
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Bibliográfico")}
                          >
                            <img
                              className="me-2"
                              src={life}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Bibliográfico
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Cômico")}
                          >
                            <img
                              className="me-2"
                              src={clownWithHat}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Cômico
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Dramático")}
                          >
                            <img
                              className="me-2"
                              src={theater}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Dramático
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Romântico")}
                          >
                            <img
                              className="me-2"
                              src={hearts}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Romântico
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div
                      className={`d-flex btn bg-pink text-primary align-items-center justify-content-center rounded-5
      ${plan.maxQtdCallIASugestions - qtdCallIASugestionsUsed == 0 ? " disabled" : ""}`}
                      style={{ height: "32px" }}
                      onClick={handleIASuggestionClick}
                    >
                      <b className="f-12">Texto sugerido pelo IAutor</b>
                      <img className="ps-1" src={artificialInteligence} />
                    </div>
                  </div>
                  {/* Limite caracter, temas e botão IA - MOBILE */}
                  <div className="clearfix w-100 d-flex d-md-none paddingLimitesTemas">
                    <span className="float-start  w-50 text-muted f-14">
                      {answer.length} / {question.maxLimitCharacters}
                    </span>

                    <span className="float-end  w-25  ">
                      <Dropdown drop="up">
                        <Dropdown.Toggle
                          className="btn bg-pink text-primary d-flex align-items-center justify-content-center rounded-5"
                          style={{ width: "48px", height: "32px" }}
                          id="dropdown-basic"
                        >
                          {theme === "Tradicional" ? (
                            <img
                              className="me-2"
                              src={openBook}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : theme === "Bibliográfico" ? (
                            <img
                              className="me-2"
                              src={life}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : theme === "Cômico" ? (
                            <img
                              className="me-2"
                              src={clownWithHat}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : theme === "Dramático" ? (
                            <img
                              className="me-2"
                              src={theater}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : theme === "Romântico" ? (
                            <img
                              className="me-2"
                              src={hearts}
                              style={{ height: "18px", width: "18px" }}
                            />
                          ) : (
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "16px" }}
                            >
                              mood
                            </span>
                          )}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="f-14">
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Tradicional")}
                          >
                            <img
                              className="me-2"
                              src={openBook}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Tradicional
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Bibliográfico")}
                          >
                            <img
                              className="me-2"
                              src={life}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Bibliográfico
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Cômico")}
                          >
                            <img
                              className="me-2"
                              src={clownWithHat}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Cômico
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Dramático")}
                          >
                            <img
                              className="me-2"
                              src={theater}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Dramático
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setTheme("Romântico")}
                          >
                            <img
                              className="me-2"
                              src={hearts}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Romântico
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </span>
                    <span className="float-end  w-25 text-end bg-danger">
                      <Dropdown drop="up">
                        <Dropdown.Toggle
                          className="btn bg-pink text-primary d-flex align-items-center justify-content-center rounded-5"
                          style={{ width: "48px", height: "32px" }}
                          id="dropdown-basic-1"
                          as={CustomToggle}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "16px" }}
                          >
                            more_vert
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="f-14">
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={handleIASuggestionClick}
                          >
                            <img
                              className="me-2"
                              src={artificialInteligence}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Texto sugerido pelo IAutor  
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={() => setIsHelpModalOpen(true)}
                          >
                            <img
                              className="me-2"
                              src={help}
                              style={{ height: "20px", width: "20px" }}
                            />
                            Ajuda
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </span>
                  </div>

                  {/* Botões navegação das perguntas */}
                  <div className="d-flex align-items-center justify-content-between px-5 pt-3">
                    <div
                      className={` btn bg-disabled text-icon align-items-center justify-content-center rounded-5 p-3
                         d-none d-md-flex
                        ${isFirstQuestion ? " disabled" : ""}`}
                      style={{ height: "48px", minWidth: "140px" }}
                      onClick={handleBeforeQuestionClick}
                    >
                      <span
                        className="material-symbols-outlined pe-2"
                        style={{ fontSize: "24px" }}
                      >
                        arrow_left_alt
                      </span>
                      <b className="f-16 ">Voltar</b>
                    </div>
                    {/* MOBILE */}
                    <div
                      className={`d-flex d-md-none btn bg-disabled text-icon align-items-center
                        justify-content-center rounded-5 p-3 mb-5

                        ${isFirstQuestion ? " disabled" : ""}`}
                      style={{ height: "48px", width: "48px" }}
                      onClick={handleBeforeQuestionClick}
                    >
                      <span
                        className="material-symbols-outlined "
                        style={{ fontSize: "24px" }}
                      >
                        arrow_left_alt
                      </span>
                    </div>

                    <div
                      className={`d-flex btn bg-white text-black align-items-center justify-content-center rounded-5 marginButtonSaveResponsive
                      ${isLastQuestion ? " disabled" : ""}`}
                      style={{ border: "1px solid black", padding: "0.7rem" }}
                      onClick={() => {
                        saveQuestionAnswer();
                      }}
                    >
                      {isLoadingSaveAnswer ? (
                        <span
                          className="spinner-border spinner-border-sm text-black"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "24px" }}
                        >
                          save
                        </span>
                      )}
                    </div>

                    <div
                      className="d-none  d-md-flex btn bg-black text-white align-items-center justify-content-center rounded-5 p-3"
                      style={{ height: "48px", minWidth: "140px" }}
                      onClick={() => {
                        isLastQuestion
                          ? handleFinalizeClick()
                          : handleNextQuestionClick();
                      }}
                    >
                      <b className="f-16">
                        {isLastQuestion ? "Finalizar" : "Avançar"}
                      </b>
                      <span
                        className="material-symbols-outlined ps-2"
                        style={{ fontSize: "24px" }}
                      >
                        arrow_right_alt
                      </span>
                    </div>
                    {/* MOBILE */}
                    <div
                      className="d-flex d-md-none btn bg-black text-white align-items-center justify-content-center rounded-circle  mb-5"
                      style={{ height: "48px", width: "48px" }}
                      onClick={() => {
                        isLastQuestion
                          ? handleFinalizeClick()
                          : handleNextQuestionClick();
                      }}
                    >
                      <b className="f-16">{isLastQuestion ? "" : ""}</b>
                      <span
                        className="material-symbols-outlined "
                        style={{ fontSize: "24px" }}
                      >
                        arrow_right_alt
                      </span>
                    </div>
                  </div>
                  <div className="d-none d-md-flex text-black justify-content-center f-14 pt-2">
                    Salvar Resposta
                  </div>
                </div>
                {/* 2 - FIM Perguntas */}

                {/* 3 - Preview */}
                <div className="col-md-5 bg-iautor-color p-0 ">
                  <PreviewSection />
                </div>
              </div>

              {/* conteudo Mobile */}
              <div className="row d-block d-md-none">
                <Tab.Container
                  id="left-tabs-example"
                  defaultActiveKey="capitulos"
                >
                  <Nav
                    variant="underline"
                    defaultActiveKey="capitulos"
                    fill
                    className="mt-3"
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="capitulos">Capítulos</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="perguntas">Perguntas</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="preview">Preview</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content className="bgTab">
                    <Tab.Pane eventKey="capitulos">
                      {" "}
                      <CapitulosSection />
                    </Tab.Pane>
                    <Tab.Pane eventKey="perguntas">
                      <div className=" align-items-center border-bottom px-4 py-3 d-none d-md-flex">
                        <div
                          className="d-flex bg-primary align-items-center justify-content-center"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "100%",
                            marginRight: "15px",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "16px", color: "white" }}
                          >
                            quiz
                          </span>
                        </div>
                        <div className="f-14 ">
                          <b>Perguntas</b>
                          <div>
                            Responda as perguntas abaixo para criar sua história
                          </div>
                        </div>
                      </div>

                      {/* Contador de perguntas */}
                      {isLoading ? (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: "20%", borderRadius: "9px" }}
                        >
                          <div
                            className="spinner-border text-primary"
                            style={{ width: "3rem", height: "3rem" }}
                            role="status"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="d-flex align-items-center justify-content-between paddingResponsivePerguntasHeader ">
                            <div>
                              <div className="f-14">
                                Capítulo {chapter.chapterNumber}
                              </div>
                              <b className="f-16">{chapter.title}</b>
                            </div>
                            <div
                              className="text-primary fw-bold rounded-5 f-10 px-4 py-1"
                              style={{ border: "1px solid #db3737" }}
                            >
                              Pergunta {questionIndex + 1}/
                              {chapter.questions?.length}
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between paddingResponsivePerguntas ">
                            <div>
                              <span className="text-primary">
                                {questionIndex + 1} -{" "}
                              </span>
                              {question.title}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Área resposta */}
                      <div className="d-flex paddingResponsivePerguntasBody ">
                        <TextareaAutosize
                          autoFocus
                          onFocus={(e) => handlerFocus(e)}
                          onChange={(e) => {
                            setAnswer(e.target.value);
                            setAnswerChanged(true);
                          }}
                          value={answer}
                          disabled={isLoading}
                          placeholder="Digite sua resposta aqui..."
                          style={{
                            width: "100%",
                            minHeight: "300px",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #757575",
                          }}
                          minLength={question.minLimitCharacters}
                          maxLength={question.maxLimitCharacters}
                        />
                      </div>

                      {/* Limite caracter, temas e botão IA - DESKTOP */}
                      <div className="d-none d-md-flex align-items-center justify-content-between px-5 py-3">
                        <span className="text-muted f-14">
                          {answer.length} / {question.maxLimitCharacters}
                        </span>

                        <div className="d-flex justify-content-center">
                          <div
                            className="d-flex btn bg-pink text-primary align-items-center justify-content-center rounded-5 me-4"
                            style={{
                              width: "32px",
                              height: "32px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setIsHelpModalOpen(true);
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "16px" }}
                            >
                              help
                            </span>
                          </div>

                          <Dropdown drop="up">
                            <Dropdown.Toggle
                              className="btn bg-pink text-primary d-flex align-items-center justify-content-center rounded-5"
                              style={{ width: "68px", height: "32px" }}
                              id="dropdown-basic"
                            >
                              {theme === "Tradicional" ? (
                                <img
                                  className="me-2"
                                  src={openBook}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : theme === "Bibliográfico" ? (
                                <img
                                  className="me-2"
                                  src={life}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : theme === "Cômico" ? (
                                <img
                                  className="me-2"
                                  src={clownWithHat}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : theme === "Dramático" ? (
                                <img
                                  className="me-2"
                                  src={theater}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : theme === "Romântico" ? (
                                <img
                                  className="me-2"
                                  src={hearts}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : (
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: "16px" }}
                                >
                                  mood
                                </span>
                              )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="f-14">
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Tradicional")}
                              >
                                <img
                                  className="me-2"
                                  src={openBook}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Tradicional
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Bibliográfico")}
                              >
                                <img
                                  className="me-2"
                                  src={life}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Bibliográfico
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Cômico")}
                              >
                                <img
                                  className="me-2"
                                  src={clownWithHat}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Cômico
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Dramático")}
                              >
                                <img
                                  className="me-2"
                                  src={theater}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Dramático
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Romântico")}
                              >
                                <img
                                  className="me-2"
                                  src={hearts}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Romântico
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>

                        <div
                          className={`d-flex btn bg-pink text-primary align-items-center justify-content-center rounded-5
      ${plan.maxQtdCallIASugestions - qtdCallIASugestionsUsed == 0 ? " disabled" : ""}`}
                          style={{ height: "32px" }}
                          onClick={handleIASuggestionClick}
                        >
                          <b className="f-12">Texto sugerido pelo IAutor</b>
                          <img className="ps-1" src={artificialInteligence} />
                        </div>
                      </div>
                      {/* Limite caracter, temas e botão IA - MOBILE */}
                      <div className="clearfix w-100 d-flex d-md-none paddingLimitesTemas">
                        <span className="float-start  w-50 text-muted f-14">
                          {answer.length} / {question.maxLimitCharacters}
                        </span>

                        <span className="float-end  w-25  ">
                          <Dropdown drop="up">
                            <Dropdown.Toggle
                              className="btn bg-pink text-primary d-flex align-items-center justify-content-center rounded-5"
                              style={{ width: "48px", height: "32px" }}
                              id="dropdown-basic"
                            >
                              {theme === "Tradicional" ? (
                                <img
                                  className="me-2"
                                  src={openBook}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : theme === "Bibliográfico" ? (
                                <img
                                  className="me-2"
                                  src={life}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : theme === "Cômico" ? (
                                <img
                                  className="me-2"
                                  src={clownWithHat}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : theme === "Dramático" ? (
                                <img
                                  className="me-2"
                                  src={theater}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : theme === "Romântico" ? (
                                <img
                                  className="me-2"
                                  src={hearts}
                                  style={{ height: "18px", width: "18px" }}
                                />
                              ) : (
                                <span
                                  className="material-symbols-outlined"
                                  style={{ fontSize: "16px" }}
                                >
                                  mood
                                </span>
                              )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="f-14">
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Tradicional")}
                              >
                                <img
                                  className="me-2"
                                  src={openBook}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Tradicional
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Bibliográfico")}
                              >
                                <img
                                  className="me-2"
                                  src={life}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Bibliográfico
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Cômico")}
                              >
                                <img
                                  className="me-2"
                                  src={clownWithHat}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Cômico
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Dramático")}
                              >
                                <img
                                  className="me-2"
                                  src={theater}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Dramático
                              </Dropdown.Item>
                              <Dropdown.Item
                                className="d-flex align-items-center"
                                onClick={() => setTheme("Romântico")}
                              >
                                <img
                                  className="me-2"
                                  src={hearts}
                                  style={{ height: "20px", width: "20px" }}
                                />
                                Romântico
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </span>
                        <span className="float-end  w-25 text-end">
                        <img
                                  className="me-2"
                                  src={help}
                                  style={{ height: "20px", width: "20px" }}
                                  onClick={() => setIsHelpModalOpen(true)}
                                />
                        </span>

                        <span className="float-end  w-25 text-end ">
                     

                          <img
                                  className="me-2"
                                  src={artificialInteligence}
                                  onClick={handleIASuggestionClick}
                                  style={{ height: "20px", width: "20px" }}
                                />      

                        </span>
                      </div>

                      {/* Botões navegação das perguntas */}
                      <div className="d-flex align-items-center justify-content-between px-5 pt-5">
                        <div
                          className={` btn bg-disabled text-icon align-items-center justify-content-center rounded-5 p-3
                         d-none d-md-flex
                        ${isFirstQuestion ? " disabled" : ""}`}
                          style={{ height: "48px", minWidth: "140px" }}
                          onClick={handleBeforeQuestionClick}
                        >
                          <span
                            className="material-symbols-outlined pe-2"
                            style={{ fontSize: "24px" }}
                          >
                            arrow_left_alt
                          </span>
                          <b className="f-16 ">Voltar</b>
                        </div>
                        {/* MOBILE */}
                        <div
                          className={`d-flex d-md-none btn bg-disabled text-icon align-items-center
                        justify-content-center rounded-5 p-3 mb-5

                        ${isFirstQuestion ? " disabled" : ""}`}
                          style={{ height: "48px", width: "48px" }}
                          onClick={handleBeforeQuestionClick}
                        >
                          <span
                            className="material-symbols-outlined "
                            style={{ fontSize: "24px" }}
                          >
                            arrow_left_alt
                          </span>
                        </div>

                        <div
                          className={`d-flex btn bg-white text-black align-items-center justify-content-center rounded-5 marginButtonSaveResponsive
                      ${isLastQuestion ? " disabled" : ""}`}
                          style={{
                            border: "1px solid black",
                            padding: "0.7rem",
                          }}
                          onClick={() => {
                            saveQuestionAnswer();
                          }}
                        >
                          {isLoadingSaveAnswer ? (
                            <span
                              className="spinner-border spinner-border-sm text-black"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "24px" }}
                            >
                              save
                            </span>
                          )}
                        </div>

                        <div
                          className="d-none  d-md-flex btn bg-black text-white align-items-center justify-content-center rounded-5 p-3"
                          style={{ height: "48px", minWidth: "140px" }}
                          onClick={() => {
                            isLastQuestion
                              ? handleFinalizeClick()
                              : handleNextQuestionClick();
                          }}
                        >
                          <b className="f-16">
                            {isLastQuestion ? "Finalizar" : "Avançar"}
                          </b>
                          <span
                            className="material-symbols-outlined ps-2"
                            style={{ fontSize: "24px" }}
                          >
                            arrow_right_alt
                          </span>
                        </div>
                        {/* MOBILE */}
                        <div
                          className="d-flex d-md-none btn bg-black text-white align-items-center justify-content-center rounded-circle  mb-5"
                          style={{ height: "48px", width: "48px" }}
                          onClick={() => {
                            isLastQuestion
                              ? handleFinalizeClick()
                              : handleNextQuestionClick();
                          }}
                        >
                          <b className="f-16">{isLastQuestion ? "" : ""}</b>
                          <span
                            className="material-symbols-outlined "
                            style={{ fontSize: "24px" }}
                          >
                            arrow_right_alt
                          </span>
                        </div>
                      </div>
                      <div className="d-none d-md-flex text-black justify-content-center f-14 pt-2">
                        Salvar Resposta
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="preview">
                      {" "}
                      <PreviewSection />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>

            <Modal
              show={isTermsModalOpen}
              onHide={() => setIsTermsModalOpen(false)}
              centered={true}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body className="text-center justify-content-center pt-0 px-5">
                <div className="d-flex w-100 justify-content-center align-items-center">
                  <img
                    src={WomanIsTyping}
                    alt="Woman is typing laptop with lamp"
                  />
                </div>
                {termsTextModal === 1 && (
                  <>
                    <div className="d-flex justify-content-center pt-4">
                      <b className="f-22">Livro Degustação</b>
                    </div>
                    <div className="border-bottom f-15 pt-2 pb-3">
                      Bem vindo Autor, você dará inicio à criação de sua
                      história. No livro degustação você poderá experimentar a
                      criação de um livro de memórias usando os recursos da
                      plataforma <b>IAutor</b>.
                    </div>
                    <div className="d-flex justify-content-center pt-3">
                      <div
                        className="btn bg-secondary text-white rounded-5 f-12 py-2 w-60"
                        style={{ fontWeight: "bold" }}
                        onClick={() => {
                          setTermsTextModal(2);
                        }}
                      >
                        Próximo
                      </div>
                    </div>
                  </>
                )}
                {termsTextModal === 2 && (
                  <>
                    <div className="d-flex justify-content-center pt-4">
                      <b className="f-22">Temas Sensíveis</b>
                    </div>
                    <div className="border-bottom f-15 pt-2 pb-3">
                      Responda as perguntas com sinceridade e o máximo de
                      detalhes possíveis. Ao mesmo tempo, evite compartilhar
                      informações íntimas ou sensíveis.
                    </div>
                    <div className="d-flex justify-content-center pt-3">
                      <div
                        className="btn bg-secondary text-white rounded-5 f-12 py-2 w-60"
                        style={{ fontWeight: "bold" }}
                        onClick={() => {
                          setTermsTextModal(3);
                        }}
                      >
                        Próximo
                      </div>
                    </div>
                  </>
                )}
                {termsTextModal === 3 && (
                  <>
                    <div className="d-flex justify-content-center pt-4">
                      <b className="f-22">Aproveite a Experiência</b>
                    </div>
                    <div className="f-15 pt-2 pb-3">
                      Após finalizar o texto, escolha uma característica que
                      resuma a resposta (como humor ou romantismo) antes do
                      envio para a Inteligência artificial do <b>IAutor</b>.
                    </div>
                    <label className="f-12 py-3">
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={acceptedTerms}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked);
                          setErrorMessage("");
                        }}
                      />
                      Li e concordo com os{" "}
                      <div
                        className="fw-bold"
                        onClick={() => {
                          window.open(paths.TERMS, "_blank");
                        }}
                      >
                        Termos e Condições
                      </div>{" "}
                      da plataforma.
                    </label>
                    {errorMessage && (
                      <div className="d-flex justify-content-center align-items-center pb-3">
                        <span className="text-danger f-12">{errorMessage}</span>
                      </div>
                    )}
                    <div className="d-flex border-top justify-content-center pt-3">
                      <div
                        className="btn bg-secondary text-white rounded-5 f-12 py-2 w-60"
                        style={{ fontWeight: "bold" }}
                        onClick={handleAcceptTerms}
                      >
                        Começar
                      </div>
                    </div>
                  </>
                )}
              </Modal.Body>
            </Modal>

            <Modal
              show={isHelpModalOpen}
              onHide={() => setIsHelpModalOpen(false)}
              size="lg"
              centered={true}
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body
                className="text-center justify-content-center f-18 p-5"
                style={{
                  paddingTop: "3%",
                  paddingLeft: "10%",
                  paddingRight: "10%",
                }}
              >
                <div className="d-flex justify-content-center">
                  <b className="f-28">Como responder às perguntas</b>
                </div>
                <div className="pt-3">
                  Responda-as com sinceridade e o máximo de detalhes possíveis,
                  ressaltando que mais informações tornam o conteúdo mais
                  valioso.
                </div>
                <div className="pt-3">
                  Ao mesmo tempo, evite compartilhar informações íntimas ou
                  sensíveis.
                </div>
                <div className="pt-3">
                  Após finalizar o texto, escolha uma característica que resuma
                  a resposta (como humor ou romantismo) antes do envio para a
                  Inteligência artificial do <b>IAutor</b>.
                </div>
                <div className="pt-3">
                  Lembre-se que a plataforma permite voltar à versão original ou
                  fazer novas revisões, caso o resultado da revisão não seja
                  satisfatório.
                </div>
              </Modal.Body>
            </Modal>

            <Modal
              show={isIAModalOpen}
              onHide={() => setIsIAModalOpen(false)}
              size="lg"
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                <div className="d-flex justify-content-center">
                  <b className="f-28">Texto Sugerido Pelo IAutor</b>
                </div>

                <div className="d-flex justify-content-center f-16">
                  Visualize abaixo o texto sugerido pela IA e o substitua pelo
                  seu.
                </div>

                <div className="d-flex align-items-center justify-content-center mt-3">
                  <div className="d-flex bg-pink text-primary rounded-5 px-4 py-2">
                    <b className="f-12">
                      Você ainda possui{" "}
                      {plan.maxQtdCallIASugestions - qtdCallIASugestionsUsed}{" "}
                      sugestões de texto
                    </b>
                    <img className="ps-1" src={artificialInteligence} />
                  </div>
                </div>

                <div className="px-4 pt-1">
                  <div className="d-flex text-icon">
                    <b className="f-12 ms-2">Texto Escrito pelo Autor</b>
                  </div>

                  <div className="d-flex">
                    <TextareaAutosize
                      onChange={(e) => {
                        setAnswer(e.target.value);
                      }}
                      name="questionAnswer"
                      value={answer}
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        minHeight: "230px",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #757575",
                      }}
                    />
                  </div>

                  <div className="d-flex text-primary mt-2">
                    <b className="f-12 ms-2 me-1">Texto Sugerido pelo IAutor</b>
                    <img src={artificialInteligence} />
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
                    <div className="d-flex">
                      <TextareaAutosize
                        onChange={(e) => {
                          //setIAText(e.target.value);
                          handlerChangeIaText(e);
                        }}
                        name="IAText"
                        value={IAText}
                        style={{
                          width: "100%",
                          minHeight: "280px",
                          padding: "10px",
                          borderRadius: "5px",
                          border: "1px solid #757575",
                        }}
                      />
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center border-0">
                <button
                  className="btn btn-primary text-white rounded-5 f-14 px-5 py-2 me-2"
                  onClick={() => setIsIAModalOpen(false)}
                  disabled={isLoading}
                >
                  Recusar
                </button>
                <button
                  className="btn btn-secondary text-white rounded-5 f-14 px-5 py-2"
                  onClick={handleIAAccept}
                  disabled={isLoading}
                >
                  Aceitar
                </button>
              </Modal.Footer>
            </Modal>

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

            <Modal
              show={isPhotoUploadModalOpen}
              onHide={() => {
                setIsPhotoUploadModalOpen(false);
              }}
              size="lg"
              backdrop="static"
              keyboard={false}
            >
              <ModalHeader closeButton>
                <span className="text-primary">
                  <strong>
                    Inserir/Alterar foto - Capitulo {chapter.chapterNumber}
                  </strong>
                </span>
              </ModalHeader>
              <Modal.Body>
                <UploadPhotosContainer
                  closeModal={(e) => handleClosePhotoUploadModal(e)}
                  book={book}
                  questionAnsewers={questionUserAnswers}
                  plan={plan}
                  question={question}
                />
              </Modal.Body>
            </Modal>

            <Modal
              show={isFinalizeBookModalOpen}
              onHide={() => setIsFinalizeBookModalOpen(false)}
              centered={true}
            >
              <Modal.Header closeButton style={{ border: "none" }} />
              <Modal.Body className="text-center justify-content-center pt-0 px-5">
                <div className="d-flex w-100 justify-content-center align-items-center">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "60px",
                      color: "#ffc051",
                      marginRight: "3px",
                    }}
                  >
                    error
                  </span>
                </div>
                <div className="d-flex justify-content-center pt-4">
                  <b className="f-22">Atenção!</b>
                </div>
                <div className="f-15 pt-3">
                  Você ainda possui perguntas sem respostas.
                </div>
                <div className="border-bottom f-15 pb-4">
                  Tem certeza que deseja prosseguir?
                </div>
                <div className="d-flex justify-content-center pt-4 pb-3">
                  <div
                    className="btn bg-secondary text-white rounded-5 f-12 py-2 w-60"
                    style={{ fontWeight: "bold" }}
                    onClick={() => {
                      navigate(paths.HOME_LOGGED);
                    }}
                  >
                    Sim, quero continuar!
                  </div>
                  <div
                    className="btn btn-outline-secondary rounded-5 f-12 py-2 w-60 ms-2"
                    style={{ fontWeight: "bold" }}
                    onClick={() => {
                      setIsFinalizeBookModalOpen(false);
                    }}
                  >
                    Não, voltar para responder.
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </main>
        </div>
      </div>
    </>
  );
};

export default NewHistory;
