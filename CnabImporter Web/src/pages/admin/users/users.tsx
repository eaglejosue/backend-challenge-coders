import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";

import { UserService } from '../../../common/http/api/userService';
import { UserModel } from '../../../common/models/user.model';
import { UserFilter } from '../../../common/models/filters/user.filter';
import SearchInput from '../../../components/forms/searchInput/searchInput';
import CustomButton from '../../../components/forms/customButton/customButton';
import NavAdmin from '../../../components/nav/nav-admin.component';
import UserForm from './user.component';
import UserTable from './user.table';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isExitConfirmationModalOpen, setIsExitConfirmationModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const _userService = new UserService();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserModel>(new UserModel());
  const [inactivationModalOpen, setInactivationModalOpen] = useState(false);
  const [idToInactivate, setIdToInactivate] = useState(0);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = (filter?: UserFilter) => {
    setIsLoading(true);
    _userService.getAll(filter ?? new UserFilter())
      .then((response: any) => {
        setUsers(response?.length ? response : []);
      })
      .catch((e) => {
        let message = 'Error ao obter usuários.';
        if (e.response?.data?.length > 0 && e.response.data[0].message) message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log('Erro: ', message, e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearchClick = () => {
    getUsers(new UserFilter({
      filter: searchTerm
    }));
  };

  const handleEdit = (user: UserModel) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedUser(new UserModel());
    setIsFormModalOpen(true);
  };

  const handleCloseModal = (c: boolean = true) => {
    if (c) setIsExitConfirmationModalOpen(true);
    else handleExitConfirm();
  };

  const handleExitConfirm = () => {
    setIsFormModalOpen(false);
    setSelectedUser(new UserModel());
    getUsers();
    setIsExitConfirmationModalOpen(false);
  };

  const handleExitCancel = () => {
    setIsExitConfirmationModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setIdToInactivate(id);
    setInactivationModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setInactivationModalOpen(false);
    setIdToInactivate(0);
  };

  const handleDeleteConfirm = async () => {
    if (idToInactivate === 0) return;

    setIsLoading(true);
    _userService.delete(idToInactivate)
      .then(() => {
        getUsers();
        setInactivationModalOpen(false);
        setIdToInactivate(0);
      })
      .catch((e) => {
        let message = 'Error ao deletar usuário.';
        if (e.response?.data?.length > 0 && e.response.data[0].message) message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log('Erro: ', message, e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <NavAdmin />

      <main className='main bg-iautor-color pb-4'
        style={{ minHeight: '70vh' }}
      >

        <section className='container' id='title'>
          <div className='row'>
            <h4 className='mt-3 p-0'>Usuários</h4>
          </div>
        </section>

        <section className='container border-top' id='filter'>
          <div className='row my-4'>
            <div className='col-8 col-md-3 col-sm-6' style={{ paddingLeft: '0' }}>
              <SearchInput
                placeholder="Buscar Usuário"
                onChange={e => setSearchTerm(e)}
                onEnter={handleSearchClick}
              />
            </div>
            <div className='col-auto me-auto'>
              <CustomButton
                onClick={handleSearchClick}
                disabled={isLoading}
              />
            </div>
            <div className='col-auto' style={{ paddingRight: '0' }}>
              <CustomButton
                onClick={handleAddClick}
                disabled={isLoading}
                text='Novo'
                materialText='add'
              />
            </div>
          </div>
        </section>

        <section className='container mt-3 px-0' id='table'>
          <UserTable
            data={users}
            isLoading={isLoading}
            handlerEdit={handleEdit}
            handlerDelete={handleDelete}
          />
        </section>

        <Modal show={isFormModalOpen} onHide={() => handleCloseModal()} centered size='lg' backdrop="static">
          <Modal.Header closeButton className="bg-white border-0">
            <Modal.Title>{selectedUser.id == null ? 'Criar usuário' : 'Editar usuário'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <UserForm user={selectedUser} handleClose={(c) => handleCloseModal(c)} />
          </Modal.Body>
        </Modal>

        <Modal show={inactivationModalOpen} onHide={() => setInactivationModalOpen(false)} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Inativação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Você tem certeza que deseja inativar este usuário?</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn border-1 rounded-5 f-14 px-4 py-2"
              style={{ border: '1px solid #dee2e6' }}
              onClick={handleDeleteCancel}>
              Não
            </button>
            <button
              className="btn btn-primary text-white rounded-5 f-14 px-4 py-2"
              onClick={handleDeleteConfirm}>
              Sim
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={isExitConfirmationModalOpen} onHide={() => setIsExitConfirmationModalOpen(false)} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Saída</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <p className='mb-1'>Você tem certeza que deseja sair?</p>
            <p className='mb-1'>Todas as alterações não salvas serão perdidas.</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn border-1 rounded-5 f-14 px-4 py-2"
              style={{ border: '1px solid #dee2e6' }}
              onClick={handleExitCancel}>
              Não
            </button>
            <button
              className="btn btn-primary text-white rounded-5 f-14 px-4 py-2"
              onClick={handleExitConfirm}>
              Sim
            </button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default Users;
