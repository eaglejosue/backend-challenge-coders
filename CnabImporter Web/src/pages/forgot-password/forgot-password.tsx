import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import CustomInput from '../../components/forms/customInput/customInput';
import { LoginService } from '../../common/http/api/loginService';

import paths from '../../routes/paths';
import Logo from '../../assets/img/Logo.png';

const ForgotPassword = () => {
  const _loginService = new LoginService();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    setIsLoading(true);

    _loginService
        .forgotPassword(data.email)
        .then(() => {
          toast.success('Se o e-mail informado estiver cadastrado, você receberá instruções para redefinir sua senha em alguns minutos. Por favor, verifique sua caixa de entrada e spam.', {
            position: 'top-center'
          });
        })
        .catch((e) => {
          let message = 'Error ao enviar e-mail.';
          if (e.response?.data?.length > 0 && e.response.data[0].message) message = e.response.data[0].message;
          if (e.response?.data?.detail) message = e.response?.data?.detail;
          toast.error(message, {
            position: 'top-center',
            style: { maxWidth: 600 }
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  return (
    <main className='bg-iautor pb-4'
      style={{ minHeight: '760px' }}
    >

      <section className='container'>
        <div className='row justify-content-center'>

          <div className='col-12 col-sm-6 col-xl-3 bg-white shadow p-5'
            style={{ borderRadius: '9px', position: 'absolute', zIndex: 1, top: '7%', textAlign: 'center' }}
          >

            <div className='d-flex w-100 justify-content-center'>
              <img src={Logo} alt="Logo"
                onClick={() => navigate(paths.HOME)}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <div className='my-4'>
              <p className='f-14'>
                Insira seu e-mail abaixo para recuperar sua senha!
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='mt-5'>
              <div className='mt-3'>
                <CustomInput
                  type='email'
                  disabled={isLoading}
                  placeholder='Insira seu E-mail'
                  register={register}
                  errors={errors.email}
                  name='email'
                  setValue={setValue}
                  validationSchema={{
                    required: 'E-mail é obrigatório',
                    maxLength: { value: 50, message: "E-mail deve conter no máximo 50 caracteres" }
                  }}
                />
              </div>

              <div className='d-flex w-100 justify-content-center align-items-center mt-4'>
                <button className='btn btn-secondary text-white rounded-5 f-14 px-4 py-2 f-14 w-100'
                  type='submit'
                  disabled={isLoading}
                >
                  Enviar
                  {isLoading &&
                    <span
                      className="spinner-border spinner-border-sm text-light ms-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  }
                </button>
              </div>

              <div className='d-flex w-100 justify-content-center align-items-center mt-2'>
                <button className='btn btn-primary rounded-5 f-14 px-4 py-2 f-14 w-100'
                  type='button'
                  disabled={isLoading}
                  onClick={() => navigate(paths.LOGIN)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} className='mx-2' />
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

export default ForgotPassword;
