import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';

import { AuthenticatedUserModel } from '../../common/models/authenticated.model';
import { EnumUserTypes } from '../../common/enums/status.enum';
import paths from '../../routes/paths';

export interface Props {
  pageName?: string
}

const NavUserOptions = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthenticatedUserModel>();

  useEffect(() => {
    const user = AuthenticatedUserModel.fromLocalStorage();
    if (user && user.token?.length)
      setUser(user);
  }, []);

  const logout = () => {
    AuthenticatedUserModel.removeLocalStorage();
    navigate(paths.LOGIN);
  };

  return (
    <Dropdown className='col-auto text-end'>
      <Dropdown.Toggle className='bg-transparent border-0 p-0' style={{ color: 'black' }}>
        {user?.profileImgUrl
          ?
          <img src={user.profileImgUrl} alt={user.firstname}
            className='rounded-circle me-1'
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
          :
          <a target='_blank' style={{ color: 'black' }}>
            <FontAwesomeIcon icon={faUser} />
          </a>
        }
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '200px', overflow: 'hidden', padding: '10px' }}>

        <Dropdown.Item onClick={() => navigate(paths.MY_ACCOUNT)}>
          Minha Conta
          {user?.profileImgUrl &&
            <div className='d-flex align-items-center my-3'>
              <img src={user.profileImgUrl} alt={user.firstname} className="rounded-circle"
                style={{ width: '45px', height: '45px', objectFit: 'cover' }}
              />
              <div className='d-flex flex-column' style={{ marginRight: 'auto', marginLeft: '8px' }}>
                <label className='f-16 mb-0' style={{ fontWeight: '600' }}>{user.firstname}</label>
                <label className='f-12 text-muted'>{user.email}</label>
              </div>
            </div>
          }
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate(paths.MY_HISTORIES)}>Minhas Histórias</Dropdown.Item>

        {user?.type === EnumUserTypes.Admin &&
          <>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate(paths.TERMS)}>Termos</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate(paths.USERS)}>Usuários</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate(paths.CHAPTERS)}>Capítulos</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate(paths.QUESTIONS)}>Perguntas</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate(paths.PLANS)}>Planos</Dropdown.Item>
          </>
        }

        <Dropdown.Divider />
        <Dropdown.Item onClick={() => logout()}>Sair</Dropdown.Item>

      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavUserOptions;
