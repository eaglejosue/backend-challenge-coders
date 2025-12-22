import { useNavigate } from "react-router-dom";
import Logo from '../../assets/img/Logo.png';
import paths from '../../routes/paths';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <main className='main bg-iautor-color pb-4'
      style={{ minHeight: '603px' }}
    >

      <section className='container text-center'>
        <div className='row justify-content-center'>

          <div className='col-4 col-sm-8 col-md-6 col-lg-4 col-xl-3 bg-white p-5 shadow'
            style={{ borderRadius: '9px', position: 'absolute', zIndex: 1, top: '20%', textAlign: 'center' }}
          >

            <div className='d-flex w-100 justify-content-center'>
              <img src={Logo} alt="Logo"
                onClick={() => navigate(paths.HOME)}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <div className='mt-5'>
              <h3>Pagina não encontrada</h3>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
};

export default PageNotFound;
