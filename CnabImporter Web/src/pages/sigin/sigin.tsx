import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

import CustomInput from "../../components/forms/customInput/customInput";
import useScreenSize from "../../hooks/useScreenSize";
import { LoginService } from "../../common/http/api/loginService";
import { AuthenticatedUserModel } from "../../common/models/authenticated.model";
import { LoginRequest } from "../../common/models/login.request";
import { CpfValidator } from "../../common/validation/cpfValidator";
import { BirthDateValidator } from "../../common/validation/birthDateValidator";
import { EnumUserTypes } from "../../common/enums/status.enum";

import GoogleSvg24 from "../../assets/svg/icons8-google-24.svg";
import paths from "../../routes/paths";
import Logo from "../../assets/img/Logo.png";

const SigIn = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [redirect, setRedirect] = useState("");
  const { isLargeScreen, isExtraLargeScreen } = useScreenSize();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const _loginService = new LoginService();

  useEffect(() => {
    const redirect = params.get("redirect");
    if (redirect) setRedirect(redirect);
  }, []);

  const setUserAuthenticated = (response: any) => {
    const user = new AuthenticatedUserModel(response);
    AuthenticatedUserModel.saveToLocalStorage(user);
    if (!user.isValid) {
      toast.warning("CPF e Data de Nascimento obrigatórios para cadastro!", {
        position: "top-center",
        style: { minWidth: 600 },
      });
      navigate(paths.MY_ACCOUNT);
    } else {
      let url = `${paths.NEW_HISTORY}/${user.lastBookId}`;
      if (user.type === EnumUserTypes.Admin) url = paths.HOME_LOGGED;
      if (redirect?.length) url = redirect;
      navigate(url);
    }
    reset();
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (s) => {
      setIsLoading(true);

      const googleUserInfo = await _loginService.googleUserInfo(s.access_token);

      _loginService
        .sigin(
          new LoginRequest({
            email: googleUserInfo.email,
            signInWith: "Google",
            firstName: googleUserInfo.given_name,
            lastName: googleUserInfo.family_name,
            profileImgUrl: googleUserInfo.picture,
          }),
        )
        .then((response: any) => {
          setUserAuthenticated(response);
        })
        .catch((e) => {
          let message = "Error ao entrar com google!";
          if (e.response?.data?.length > 0 && e.response.data[0].message)
            message = e.response.data[0].message;
          if (e.response?.data?.detail) message = e.response?.data?.detail;
          toast.error(message, {
            position: "top-center",
            style: { maxWidth: 600 },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    onError: () => {
      toast.error("Falha ao entrar com o Google.", { position: "top-center" });
    },
    flow: "implicit",
  });

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
    watch,
  } = useForm();

  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  useEffect(() => {
    setIsPasswordMatch(watch("password") === watch("confirmPassword"));
  }, [watch("password"), watch("confirmPassword")]);

  const onSubmit = async (data: any) => {
    if (!acceptedTerms) {
      setErrorMessage(
        "Antes de prosseguir, por favor, confirme que leu e concorda com nossos termos e condições.",
      );
      return;
    } else setErrorMessage("");

    const isValid = await trigger(["password", "confirmPassword"]);
    if (isValid && isPasswordMatch) {
      setIsLoading(true);

      _loginService
        .sigin(new LoginRequest(data))
        .then(() => {
          toast.success(
            "Sua conta foi criada com sucesso! Para ativá-la, verifique seu e-mail, caso não encontre a mensagem, verifique sua caixa de spam.",
            {
              position: "top-center",
              style: { minWidth: 600 },
            },
          );
          navigate(paths.HOME_LOGGED);
          reset();
        })
        .catch((e) => {
          let message = "Error ao criar conta!";
          if (e.response?.data?.length > 0 && e.response.data[0].message)
            message = e.response.data[0].message;
          if (e.response?.data?.detail) message = e.response?.data?.detail;
          toast.error(message, {
            position: "top-center",
            style: { minWidth: 400, maxWidth: 600 },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <main className="bg-iautor-color pb-4" style={{ minHeight: "940px" }}>
      <section className="container">
        <div className="row justify-content-center">
          <div
            className="col-12 col-sm-6 col-xl-3 bg-white shadow p-5"
            style={{
              borderRadius: "9px",
              position: "absolute",
              zIndex: 1,
              top: "7%",
              textAlign: "center",
            }}
          >
            <div className="d-flex w-100 justify-content-center">
              <img
                src={Logo}
                alt="Logo"
                onClick={() => navigate(paths.HOME)}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="my-4">
              <p className="f-14">Inscreva-se para contar sua história!</p>
            </div>

            <div className="d-flex w-100 justify-content-center align-items-center mt-3">
              <button
                className="btn rounded-5 f-14 px-4 py-2 f-14 w-80"
                type="button"
                style={{ border: "1px solid #dee2e6" }}
                onClick={() => googleLogin()}
                disabled={isLoading}
              >
                <img
                  className="mx-2"
                  width="24"
                  height="24"
                  src={GoogleSvg24}
                  alt="google-logo"
                />
                Entrar com o Google
              </button>
            </div>

            <div className="mt-3">
              <p className="text-muted f-12 mb-1">
                Ou preencha os dados abaixo
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-12">
                  <CustomInput
                    type="email"
                    disabled={false}
                    placeholder="E-mail"
                    register={register}
                    errors={errors.email}
                    name="email"
                    setValue={setValue}
                    validationSchema={{
                      required: "E-mail é obrigatório",
                      maxLength: {
                        value: 50,
                        message: "E-mail deve conter no máximo 50 caracteres",
                      },
                    }}
                    maxLength={50}
                    divClassName="mt-3"
                  />
                </div>

                <div className="col-12 col-lg-6">
                  <CustomInput
                    type="text"
                    disabled={false}
                    placeholder="Nome"
                    register={register}
                    errors={errors.firstName}
                    name="firstName"
                    setValue={setValue}
                    validationSchema={{
                      required: "Nome é obrigatório",
                      maxLength: {
                        value: 15,
                        message: "Nome deve conter no máximo 15 caracteres",
                      },
                    }}
                    maxLength={15}
                    divClassName="col-12 mt-3"
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <CustomInput
                    type="text"
                    disabled={false}
                    placeholder="Sobrenome"
                    register={register}
                    errors={errors.lastName}
                    name="lastName"
                    setValue={setValue}
                    validationSchema={{
                      required: "Sobrenome é obrigatório",
                      maxLength: {
                        value: 15,
                        message:
                          "Sobrenome deve conter no máximo 15 caracteres",
                      },
                    }}
                    maxLength={15}
                    divClassName="col-12 mt-3"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-6">
                  <CustomInput
                    type="cpf"
                    disabled={isLoading}
                    placeholder="CPF"
                    register={register}
                    errors={errors.cpf}
                    name="cpf"
                    setValue={setValue}
                    validationSchema={{ required: "CPF é obrigatório" }}
                    customValidation={(value) => CpfValidator.isValidCPF(value)}
                    divClassName="col-12 mt-3"
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <CustomInput
                    type="date"
                    disabled={false}
                    label="Data de Nascimento"
                    register={register}
                    errors={errors.birthDate}
                    name="birthDate"
                    setValue={setValue}
                    validationSchema={{ required: "Data é obrigatório" }}
                    customValidation={(value) =>
                      BirthDateValidator.isAdult(value)
                    }
                    divClassName="col-12 mt-3"
                  />
                </div>
              </div>

              <div className="d-flex w-100 align-items-left mt-4">
                <h1 className="f-12">Defina a sua senha</h1>
              </div>

              <div className="d-flex w-100 mt-0">
                <p className="f-12" style={{ textAlign: "start" }}>
                  Sua senha deve ter no mínimo 8 dígitos com números, letras
                  maiúsculas e caracteres especiais (Exemplo: ./#*).
                </p>
              </div>

              <div className="row">
                <div className="col-12 col-lg-6">
                  <CustomInput
                    type="password"
                    disabled={false}
                    placeholder="Nova senha"
                    register={register}
                    errors={errors.password}
                    name="password"
                    setValue={setValue}
                    passBtnLeft={
                      isExtraLargeScreen ? "83%" : isLargeScreen ? "70%" : "83%"
                    }
                    divClassName="col-12 mt-3"
                    validationSchema={{
                      required: "Senha é obrigatório",
                      minLength: {
                        value: 8,
                        message:
                          "A senha deve conter no mínimo 8 caracteres e deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
                      },
                      maxLength: {
                        value: 30,
                        message: "A senha deve conter no máximo 30 caracteres",
                      },
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
                        message:
                          "A senha deve conter no mínimo 8 caracteres e deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especia",
                      },
                    }}
                    maxLength={30}
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <CustomInput
                    type="password"
                    disabled={false}
                    placeholder="Confirme a senha"
                    register={register}
                    errors={errors.confirmPassword}
                    name="confirmPassword"
                    setValue={setValue}
                    passBtnLeft={
                      isExtraLargeScreen ? "83%" : isLargeScreen ? "70%" : "83%"
                    }
                    divClassName="col-12 mt-3"
                    validationSchema={{
                      required: "Confirmar Senha",
                      minLength: {
                        value: 8,
                        message: "A Senha deve conter no mínimo 8 caracteres",
                      },
                      maxLength: {
                        value: 30,
                        message: "A Senha deve conter no máximo 30 caracteres",
                      },
                      validate: (value: any) =>
                        value === watch("password") ||
                        "As senhas não coincidem",
                    }}
                    maxLength={30}
                  />
                </div>
              </div>

              <div className="d-flex w-100 align-items-left mt-4">
                <label
                  className="text-muted f-12"
                  style={{ textAlign: "start" }}
                >
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
                  <span
                    className="fw-bold"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(`${paths.PAYMENT_TERMS}/0`, "_blank");
                    }}
                  >
                    Termos e Condições
                  </span> da plataforma.
                </label>
              </div>

              <div className="d-flex mr-1 mt-1">
                {errorMessage && (
                  <span className="text-danger f-12">{errorMessage}</span>
                )}
              </div>

              <div className="d-flex w-100 mt-3">
                <p className="text-muted f-12" style={{ textAlign: "start" }}>
                  Ao criar a Conta no IAutor, você está ciente de que seus dados
                  pessoais serão tratados de acordo com a nossa Política de
                  Privacidade.
                </p>
              </div>

              <div className="d-flex w-100 justify-content-center align-items-center mt-2">
                <button
                  className="btn btn-secondary text-white rounded-5 f-14 px-4 py-2 f-14 w-80"
                  type="submit"
                  disabled={isLoading}
                >
                  Criar Conta
                  {isLoading && (
                    <span
                      className="spinner-border spinner-border-sm text-light ms-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                </button>
              </div>

              <div className="d-flex w-100 justify-content-center align-items-center mt-2">
                <button
                  className="btn btn-primary rounded-5 f-14 px-4 py-2 f-14 w-80"
                  type="button"
                  disabled={isLoading}
                  onClick={() => navigate(paths.LOGIN)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="mx-2" />
                  Voltar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SigIn;
