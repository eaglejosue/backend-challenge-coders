import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import CustomInput from '../../components/forms/customInput/customInput';
import { UserService } from '../../common/http/api/userService';
import { UserModel } from '../../common/models/user.model';


export interface ChangePasswordFormProps {
  userId: number;
  isLoading: boolean;
}

const ChangePasswordForm = (p: ChangePasswordFormProps) => {
  const _userService = new UserService();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm();

  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  useEffect(() => {
    setIsPasswordMatch(watch("newPassword") === watch("confirmPassword"));
  }, [watch("newPassword"), watch("confirmPassword")]);

  const onSubmitPasswordChange = async (data: any) => {
    const isValid = await trigger(["newPassword", "confirmPassword"]);
    if (isValid && isPasswordMatch) {
      setIsLoading(true);

      _userService
        .patch(new UserModel({
          id: p.userId,
          oldPassword: data.oldPassword,
          password: data.newPassword
        }))
        .then(() => {
          setValue('oldPassword', '');
          setValue('newPassword', '');
          setValue('confirmPassword', '');
          toast.success('Senha alterada com sucesso!', { position: 'top-center' });
        })
        .catch((e) => {
          let message = 'Error ao alterar senha!';
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitPasswordChange)}>
      <div className='p-3 d-block d-md-none text-center'>
        <p className="mb-0 p-0 fw-bold f-18">Altere sua Senha</p>
        <p className='f-14'>Sua senha deve ter no mínimo 8 dígitos com números,  letras, <br></br> maiúscula e caracteries especiais (Exemplo: ./#*)</p>
      </div>
      <div className='p-3  d-none d-md-block'>
        <p className="mb-0 p-0 fw-bold f-18">Altere sua Senha</p>
        <p className='f-14'>Sua senha deve ter no mínimo 8 dígitos com números,  letras, <br></br> maiúscula e caracteries especiais (Exemplo: ./#*)</p>
      </div>

      <div className='row p-3'>
        <div className='col-12 col-md-4'>
          <CustomInput
            type='password'
            disabled={false}
            label='Antiga Senha'
            register={register}
            errors={errors.oldPassword}
            name='oldPassword'
            setValue={setValue}
            validationSchema={{
              required: 'Senha é obrigatório',
              maxLength: { value: 30, message: "A Senha deve conter no máximo 30 caracteres" },
            }}
            maxLength={30}
            passBtnLeft='84%'
            divClassName='col-12 mt-4'
          />
        </div>

        <div className='col-12 col-md-4'>
          <CustomInput
            type='password'
            disabled={false}
            label='Nova senha'
            register={register}
            errors={errors.newPassword}
            name='newPassword'
            setValue={setValue}
            passBtnLeft='84%'
            divClassName='col-12 mt-4'
            validationSchema={{
              required: 'Senha é obrigatório',
              minLength: {
                value: 8,
                message: "A senha deve conter no mínimo 8 caracteres e deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
              },
              maxLength: { value: 30, message: "A Senha deve conter no máximo 30 caracteres" },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
                message:
                  "A senha deve conter no mínimo 8 caracteres e deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especia",
              },
              validate: (value: any) => value !== watch("oldPassword") || "Escolha uma senha diferente da antiga"
            }}
            maxLength={30}
          />
        </div>

        <div className='col-12 col-md-4'>
          <CustomInput
            type='password'
            disabled={false}
            label='Confirme a senha'
            register={register}
            errors={errors.confirmPassword}
            name='confirmPassword'
            setValue={setValue}
            passBtnLeft='84%'
            divClassName='col-12 mt-4'
            validationSchema={{
              required: 'Confirmar Senha',
              minLength: { value: 8, message: "A Senha deve conter no mínimo 8 caracteres" },
              maxLength: { value: 30, message: "A Senha deve conter no máximo 30 caracteres" },
              validate: (value: any) => value === watch("newPassword") || "As senhas não coincidem",
            }}
            maxLength={30}
          />
        </div>
      </div>

      <div className='d-flex justify-content-end mt-4 p-3 alignResponsive'>
        <button className='btn btn-primary text-white rounded-5 f-14 px-4 p-2'
          type="submit"
          disabled={isLoading || p.isLoading}
        >
          Alterar Senha
          {isLoading &&
            <span
              className="spinner-border spinner-border-sm text-light ms-2"
              role="status"
              aria-hidden="true"
            ></span>
          }
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
