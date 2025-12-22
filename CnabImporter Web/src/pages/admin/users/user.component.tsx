import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { UserService } from '../../../common/http/api/userService';
import { UserModel } from '../../../common/models/user.model';
import { CpfValidator } from '../../../common/validation/cpfValidator';
import { BirthDateValidator } from '../../../common/validation/birthDateValidator';
import CustomInput from '../../../components/forms/customInput/customInput';
import CustomSelect from '../../../components/forms/customSelect/customSelect';

export interface UserFormProps {
  user: UserModel;
  handleClose: (c?: boolean) => void;
}

const UserForm = (p: UserFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const _userService = new UserService();
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const isNew = p.user.id == null;

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm();

  useEffect(() => {
    setValue('type', p.user.type);
    setValue('firstName', p.user.firstName);
    setValue('lastName', p.user.lastName);
    setValue('email', p.user.email);
    setValue('cpf', p.user.cpf);
    setValue('birthDate', p.user.birthDate ? p.user.birthDate.split('T')[0] : '');
    p.user.profileImgUrl && setProfileImgUrl(p.user.profileImgUrl);
  }, []);

  useEffect(() => {
    setIsPasswordMatch(watch("password") === watch("confirmPassword"));
  }, [watch("password"), watch("confirmPassword")]);

  const onSubmit = async (data: any) => {
    const isValid = await trigger(["password", "confirmPassword"]);
    if (isValid && isPasswordMatch) {
      setIsLoading(true);

      let signInWith = 'Default';
      if (data.email && data.email.includes('gmail.com'))
        signInWith = 'Google';

      let user = new UserModel({
        ...data,
        id: p.user.id,
        signInWith: signInWith,
        profileImgUrl: profileImgUrl,
      });
      //console.log('Usuário', JSON.stringify(user));

      if (user.id == null) {
        _userService
          .post(user)
          .then(() => {
            toast.success('Usuário criado com sucesso!', {
              position: 'top-center',
              style: { minWidth: 400 }
            });
            p.handleClose(false);
          })
          .catch((e) => {
            let message = 'Error ao salvar dados.';
            if (e.response?.data?.length > 0 && e.response.data[0].message) message = e.response.data[0].message;
            if (e.response?.data?.detail) message = e.response?.data?.detail;
            toast.error(message, {
              position: 'top-center',
              style: { minWidth: 400 }
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        _userService
          .put(user)
          .then(() => {
            toast.success('Informações salvas com sucesso!', {
              position: 'top-center',
              style: { minWidth: 400 }
            });
            p.handleClose(false);
          })
          .catch((e) => {
            let message = 'Error ao salvar informações.';
            if (e.response?.data?.length > 0 && e.response.data[0].message) message = e.response.data[0].message;
            if (e.response?.data?.detail) message = e.response?.data?.detail;
            toast.error(message, {
              position: 'top-center',
              style: { minWidth: 400 }
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='row pt-0 px-4'>
        <h4>Dados Pessoais</h4>
        <hr />

        <div className='col-auto mt-3 pr-0'>
          <div className="rounded-circle bg-light d-flex justify-content-center align-items-center"
            style={{ width: '100px', height: '100px', position: 'relative' }}
          >
            {profileImgUrl ? (
              <img
                src={profileImgUrl}
                alt="User"
                className="rounded-circle"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span className="material-symbols-outlined" style={{ fontSize: '45px', color: '#6c63ff' }}>
                person
              </span>
            )}
          </div>
        </div>

        <div className='col'>
          <div className='row'>
            <div className='col-4 pr-0'>
              <CustomInput
                type='text'
                disabled={isLoading}
                label='Nome *'
                placeholder='Nome'
                register={register}
                errors={errors.firstName}
                name='firstName'
                setValue={setValue}
                divClassName='col-12 mt-4'
                validationSchema={{
                  required: 'Nome é obrigatório',
                  maxLength: { value: 15, message: "Nome deve conter no máximo 15 caracteres" }
                }}
                maxLength={15}
              />
            </div>
            <div className='col-4 pr-0'>
              <CustomInput
                type='text'
                disabled={isLoading}
                label='Sobrenome *'
                placeholder='Sobrenome'
                register={register}
                errors={errors.lastName}
                name='lastName'
                setValue={setValue}
                divClassName='col-12 mt-4'
                validationSchema={{
                  required: 'Sobrenome é obrigatório',
                  maxLength: { value: 15, message: "Sobrenome deve conter no máximo 15 caracteres" }
                }}
                maxLength={15}
              />
            </div>
            <div className='col-4'>
              <CustomInput
                type='cpf'
                disabled={isLoading}
                label='CPF *'
                placeholder='CPF'
                register={register}
                errors={errors.cpf}
                name='cpf'
                setValue={setValue}
                validationSchema={{ required: 'CPF é obrigatório' }}
                customValidation={(value) => CpfValidator.isValidCPF(value)}
                divClassName='col-12 mt-4'
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-3 pr-0'>
              <CustomSelect
                label='Tipo *'
                disabled={isLoading}
                register={register}
                errors={errors.type}
                name='type'
                divClassName='mt-4'
                validationSchema={{ required: 'Tipo é obrigatório' }}
                options={[
                  { value: 'Default', label: 'Comum' },
                  { value: 'Admin', label: 'Administrador' },
                  { value: 'Operator', label: 'Operador' },
                  { value: 'Influencer', label: 'Influencer' },
                  { value: 'Agent', label: 'Agente' },
                ]}
              />
            </div>
            <div className='col-5 pr-0'>
              <CustomInput
                type='email'
                disabled={!isNew}
                label='Email *'
                placeholder='Email'
                register={register}
                errors={errors.email}
                name='email'
                setValue={setValue}
                divClassName='col-12 mt-4'
                validationSchema={{
                  required: 'Email é obrigatório',
                  maxLength: { value: 50, message: "E-mail deve conter no máximo 50 caracteres" },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email inválido',
                  }
                }}
                maxLength={50}
              />
            </div>
            <div className='col-4'>
              <CustomInput
                type='date'
                disabled={isLoading}
                label='Data de Nascimento *'
                placeholder='Data de Nascimento'
                register={register}
                errors={errors.birthDate}
                name='birthDate'
                setValue={setValue}
                divClassName='col-12 mt-4'
                validationSchema={{ required: 'Data é obrigatório' }}
                customValidation={(value) => BirthDateValidator.isAdult(value)}
              />
            </div>
          </div>
        </div>

      </div>

      {isLoading &&
        <div className='d-flex justify-content-center align-items-center' style={{ height: '100%', borderRadius: '9px' }}>
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status" />
        </div>
      }

      {isNew &&
        <div className='row my-3 pt-0 px-4'>
          <h4 className='mt-3'>Login</h4>
          <hr />

          <div className='col-5'>
            <CustomInput
              type='password'
              disabled={!isNew}
              label='Nova senha *'
              placeholder='Nova senha'
              register={register}
              errors={errors.password}
              name='password'
              setValue={setValue}
              passBtnLeft='87%'
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
                }
              }}
              maxLength={30}
            />
          </div>
          <div className='col-5'>
            <CustomInput
              type='password'
              disabled={!isNew}
              label='Confirme a senha *'
              placeholder='Confirme a senha'
              register={register}
              errors={errors.confirmPassword}
              name='confirmPassword'
              setValue={setValue}
              passBtnLeft='87%'
              divClassName='col-12 mt-4'
              validationSchema={{
                required: 'Confirmar Senha',
                minLength: { value: 8, message: "A Senha deve conter no mínimo 8 caracteres" },
                maxLength: { value: 30, message: "A Senha deve conter no máximo 30 caracteres" },
                validate: (value: any) =>
                  value === watch("password") || "As senhas não coincidem",
              }}
              maxLength={30}
            />
          </div>
        </div>
      }

      <div className='d-flex justify-content-end mt-4'>
        <button className='btn rounded-5 f-14 px-4 py-2 mx-2'
          type='button'
          style={{ border: '1px solid #dee2e6' }}
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            p.handleClose();
          }}
        >
          Cancelar
        </button>
        <button className='btn btn-primary text-white rounded-5 f-14 px-4 py-2'
          type="submit"
          disabled={isLoading}
        >
          Salvar Informações
          {isLoading && <span className="spinner-border spinner-border-sm text-light ms-2" role="status" aria-hidden="true"></span>}
        </button>
      </div>

    </form>
  );
};

export default UserForm;