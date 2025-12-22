import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import CustomInput from "../../components/forms/customInput/customInput";
import { LoginService } from "../../common/http/api/loginService";
import { ResetPasswordRequest } from "../../common/models/resetPassword.request";
import { AuthenticatedUserModel } from "../../common/models/authenticated.model";

import paths from "../../routes/paths";
import Logo from "../../assets/img/Logo.png";

const ResetPassword = () => {
  const _loginService = new LoginService();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params] = useSearchParams();

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
    setIsPasswordMatch(watch("newPassword") === watch("confirmPassword"));
  }, [watch("newPassword"), watch("confirmPassword")]);

  const onSubmit = async (data: any) => {
    const isValid = await trigger(["newPassword", "confirmPassword"]);
    if (isValid && isPasswordMatch) {
      setIsLoading(true);

      _loginService
        .resetPassword(
          new ResetPasswordRequest({
            resetPasswordCode: params.get("code"),
            newPassword: data.newPassword,
          }),
        )
        .then(() => {
          toast.success("Sucesso ao trocar senha.", { position: "top-center" });
          AuthenticatedUserModel.removeLocalStorage();
          navigate(paths.LOGIN);
          reset();
        })
        .catch((e) => {
          let message = "Erro ao trocar senha!";
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
    }
  };

  return (
    <main className="bg-iautor-color pb-4" style={{ minHeight: "600px" }}>
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
              <p className="f-14">Insira abaixo sua nova senha!</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
              <div className="mt-3">
                <CustomInput
                  type="password"
                  disabled={isLoading}
                  label="Insira Nova Senha"
                  setValue={setValue}
                  register={register}
                  errors={errors.newPassword}
                  name="newPassword"
                  validationSchema={{
                    required: "Senha é obrigatório",
                    minLength: {
                      value: 8,
                      message:
                        "A senha deve conter no mínimo 8 caracteres e deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
                      message:
                        "A senha deve conter no mínimo 8 caracteres e deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especia",
                    },
                  }}
                />
              </div>
              <div className="mt-3">
                <CustomInput
                  type="password"
                  disabled={isLoading}
                  label="Confirme a nova senha"
                  setValue={setValue}
                  register={register}
                  errors={errors.confirmPassword}
                  name="confirmPassword"
                  validationSchema={{
                    required: "Confirmar Senha",
                    validate: (value: any) =>
                      value === watch("newPassword") ||
                      "As senhas não coincidem",
                  }}
                />
              </div>

              <div className="d-flex w-100 mt-4">
                <p className="f-12" style={{ textAlign: "start" }}>
                  Sua senha deve ter no mínimo 8 dígitos com números, letras
                  maiúsculas e caracteres especiais (Exemplo: ./#*).
                </p>
              </div>

              <div className="d-flex w-100 justify-content-center align-items-center mt-4">
                <button
                  className="btn btn-secondary text-white rounded-5 f-14 px-4 py-2 f-14 w-100"
                  type="submit"
                  disabled={isLoading}
                >
                  Salvar
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
                  className="btn btn-primary rounded-5 f-14 px-4 py-2 f-14 w-100"
                  type="button"
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

export default ResetPassword;
