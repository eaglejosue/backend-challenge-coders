import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import { AuthenticatedUserModel } from '../../../common/models/authenticated.model';
import { EnumUserTypes } from '../../../common/enums/status.enum';
import { ParamModel } from '../../../common/models/param.model';
import { ParamService } from '../../../common/http/api/paramService';

import constParams from '../../../common/constants/constParams';
import NavUserOptions from '../../../components/nav/nav-user-options.component';
import Sidebar from '../../../components/nav/sidebar.component';

import horizontalImgs from '../../../assets/horizontal-imgs';

const Terms = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const _paramService = new ParamService();
  const [paramModel, setParamModel] = useState<ParamModel>(new ParamModel());
  const [errorMessage, setErrorMessage] = useState('');
  const [imgRandomSrc, setImgRandomSrc] = useState('1');

  const {
    handleSubmit,
    register,
    setValue
  } = useForm();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 16);// Gera um número entre 0 e 15
    setImgRandomSrc(horizontalImgs[randomIndex]);

    const user = AuthenticatedUserModel.fromLocalStorage()!;
    setIsEdit(user.type === EnumUserTypes.Admin);

    getParam(constParams.Terms);
  }, []);

  const getParam = (key: string) => {
    setIsLoading(true);

    _paramService
      .getByKey(key)
      .then((response: any) => {
        setParamModel(new ParamModel(response));
        setValue('value', response.value);
      })
      .catch((e) => {
        let message = 'Error ao obter termos.';
        if (e.response?.data?.length > 0 && e.response.data[0].message) message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log('Erro: ', message, e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = async (data: any) => {
    if (data.value.length > 0) {
      setErrorMessage('');

      if (data.value === paramModel.value) {
        toast.warning('Texto sem alterações!', { position: 'top-center' });
        return;
      }
    }
    else {
      setErrorMessage('Antes de prosseguir, por favor, preencha os termos.');
      return;
    }

    setIsLoading(true);

    _paramService
      .put(
        new ParamModel({
          id: paramModel.id,
          key: paramModel.key,
          value: data.value,
        }),
      )
      .then(() => {
        toast.success('Informações salvas com sucesso!', { position: 'top-center' });
      })
      .catch((e) => {
        let message = 'Error ao salvar informações!';
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
    <div className='d-flex'
      style={{ height: '100vh' }}
    >
      <Sidebar navItem='' />
      <section className='flex-grow-1'>

        <header className='bg-white border-bottom py-3 px-4'>
          <div className='row align-items-center justify-content-beetwen'>
          <div className='col-auto fw-bold f-18 pe-0'>
              IAutor /
            </div>
            <div className='col-auto f-18 ps-1'>
              Termos
            </div>
            <div className='col'>
              <NavUserOptions />
            </div>
          </div>
        </header>

        <main className='main bg-white'>
          <div className='container-fluid'>
            <div className='row'>

              <div className='col-12 col-xl-8 border-end' id='user-form'>

                <div className='row border-bottom p-3'>
                  <b className='f-18'>Termos</b>
                  <div className='f-16'>Visualize ou altere abaixo as informações do Termo.</div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='row p-3 mt-5'>
                    <div className='col-12 col-lg-6'
                      style={{ width: '100%' }}
                    >
                      <TextareaAutosize
                        {...register('value')}
                        disabled={!isEdit}
                        onChange={(e) => { setValue('value', e.target.value) }}
                        placeholder='Digite aqui os termos de uso...'
                        style={{
                          width: '100%',
                          minHeight: '388px',
                          padding: '10px',
                          borderRadius: '5px',
                          border: '1px solid #0580fa',
                        }}
                      />
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                      {errorMessage && <span className='text-danger f-14'>{errorMessage}</span>}
                    </div>
                  </div>

                  {isEdit &&
                    <div className='d-flex justify-content-end p-3'>
                      <button className='btn btn-primary text-white rounded-5 f-14 px-4 p-2'
                        type="submit"
                        disabled={isLoading}
                      >
                        Salvar
                        {isLoading && <span className="spinner-border spinner-border-sm text-light ms-2" role="status" aria-hidden="true"></span>}
                      </button>
                    </div>
                  }
                </form>

              </div>

              {/* Img baixo */}
              <div className='col-12 col-xl-4'
                style={{ minHeight: '845px' }}
              >
                <div id='img-baixo' style={{ marginTop: '40vh' }}>

                  <div className='d-flex justify-content-center'>
                    <img src={imgRandomSrc} style={{ minWidth: '314px', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
                  </div>
                  <div className='d-flex justify-content-center mt-2 p-2'>
                    <b className='f-16'>Uma História mais Completa</b>
                  </div>

                  <div className='d-flex text-center f-14 px-4'>
                    Formate a escrita, edite a capa e crie histórias com mais detalhes e momentos.
                  </div>

                  <div className='d-flex justify-content-center p-4'>
                    <a href='#' className='btn bg-secondary text-white rounded-5 f-12 px-4 py-2 w-50'
                      style={{ fontWeight: 'bold' }}
                    >
                      Ver Planos
                    </a>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </main>

      </section>
    </div>
  );
};

export default Terms;
