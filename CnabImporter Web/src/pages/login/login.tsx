import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

import { LoginService } from "../../common/http/api/loginService";
import { LoginRequest } from "../../common/models/login.request";
import { AuthenticatedUserModel } from "../../common/models/authenticated.model";
import { EnumUserTypes } from "../../common/enums/status.enum";

import CustomInput from "../../components/forms/customInput/customInput";

import GoogleSvg24 from "../../assets/svg/icons8-google-24.svg";
import paths from "../../routes/paths";
import Logo from "../../assets/img/Logo.png";

const Login = () => {
  const _loginService = new LoginService();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [redirect, setRedirect] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const code = params.get("code");
    if (code) {
      setIsLoading(true);

      _loginService
        .activate(code)
        .then((response: any) => {
          setUserAuthenticated(response);
          toast.success("Conta ativada com sucesso!", {
            position: "top-center",
          });
        })
        .catch((e) => {
          let message = "Error ativar conta.";
          if (e.response?.data?.length > 0 && e.response.data[0].message)
            message = e.response.data[0].message;
          if (e.response?.data?.detail) message = e.response?.data?.detail;
          console.log("Erro: ", message, e);
          toast.error(message, {
            position: "top-center",
            style: { maxWidth: 600 },
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    const redirect = params.get("redirect");
    if (redirect) {
      setRedirect(redirect);

      const user = AuthenticatedUserModel.fromLocalStorage();
      if (user?.token) {
        navigate(redirect);
        return;
      }
    }
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

  const handleForgotPasswordClick = () => {
    navigate(paths.FORGOT_PASSWORD);
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
    onError: (e) => {
      console.log("Erro: ", e);
      toast.error("Falha ao entrar com o Google.", { position: "top-center" });
    },
    flow: "implicit",
  });

  const handleSigInClick = () => navigate(`${paths.SIGIN}?redirect=${redirect}`);

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    setIsLoading(true);

    _loginService
      .login(new LoginRequest(data))
      .then((response: any) => {
        setUserAuthenticated(response);
      })
      .catch((e) => {
        let message =
          "Error ao logar, verifique se o E-mail e Senha estão corretos e tente novamente!";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Login erro: ", e);
        toast.error(message, {
          position: "top-center",
          style: { minWidth: 600 },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="bg-iautor pb-4" style={{ minHeight: "760px" }}>
      <section className="container">
        <div className="row justify-content-center">
          <div
            className="col-12 col-sm-6 col-xl-3 bg-white text-center rounded-3 shadow p-5"
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
              <p className="f-14">
                Insira seu e-mail abaixo para criar sua história!
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="mt-3">
                <CustomInput
                  type="email"
                  disabled={isLoading}
                  placeholder="Insira seu E-mail"
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
                  divClassName="col-12"
                />
              </div>
              <div className="mt-3">
                <CustomInput
                  type="password"
                  disabled={isLoading}
                  placeholder="Insira sua Senha"
                  setValue={setValue}
                  register={register}
                  errors={errors.password}
                  name="password"
                  passBtnLeft="85%"
                  validationSchema={{
                    required: "Senha é obrigatório",
                    minLength: {
                      value: 6,
                      message: "A Senha deve conter no mínimo 6 caracteres",
                    },
                    maxLength: {
                      value: 30,
                      message: "A Senha deve conter no máximo 30 caracteres",
                    },
                  }}
                  maxLength={30}
                  divClassName="col-12"
                />
              </div>

              <div className="d-flex w-100 justify-content-center align-items-center mt-4">
                <button
                  className="btn bg-secondary text-white rounded-5 f-14 px-4 py-2 w-100"
                  type="submit"
                  disabled={isLoading}
                >
                  Entrar
                  {isLoading && (
                    <span
                      className="spinner-border spinner-border-sm text-light ms-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                </button>
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <button
                  className="btn btn-link text-black mt-3 f-14"
                  type="button"
                  onClick={handleForgotPasswordClick}
                  disabled={isLoading}
                >
                  Esqueci minha Senha
                </button>
              </div>

              <div className="mt-3">
                <p className="text-muted f-12">Ou Escolha</p>
              </div>

              <div className="d-flex w-100 justify-content-center align-items-center mt-3">
                <button
                  className="btn rounded-5 f-14 px-4 py-2 f-14 w-100"
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

              <div className="mt-4">
                <p className="text-muted f-12">Não tem uma conta na IAutor?</p>
              </div>

              <div className="d-flex w-100 justify-content-center align-items-center mt-4">
                <button
                  className="btn btn-primary text-white rounded-5 f-14 px-4 py-2 w-100"
                  type="button"
                  onClick={handleSigInClick}
                  disabled={isLoading}
                >
                  Clique aqui e Crie sua Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
