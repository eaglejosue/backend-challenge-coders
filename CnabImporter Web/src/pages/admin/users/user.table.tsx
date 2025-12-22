import { Table, Tag } from 'antd';
import { useState } from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import { UserModel } from '../../../common/models/user.model';

interface UserTableProps {
  data: UserModel[],
  isLoading: boolean,
  handlerEdit(model: UserModel): void
  handlerDelete(id: Number): void
}

const UserTable = (props: UserTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleDeleteClick = (id: number) => {
    props.handlerDelete(id);
  };

  const handleEditClick = (model: UserModel) => {
    props.handlerEdit(model)
  };

  const columns = [
    {
      title: '',
      dataIndex: 'profileImgUrl',
      align: 'center' as 'center',
      render: (_: any, record: UserModel) => record.profileImgUrl &&
        <img src={record.profileImgUrl} alt={record.fullname} className="rounded-circle"
          style={{ width: '45px', height: '45px', objectFit: 'cover' }}
        />
    },
    {
      title: 'Nome',
      dataIndex: 'fullname',
      sorter: (a: any, b: any) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: 'Login',
      dataIndex: 'signInWith',
      render: (signInWith: string) => (
        <Tag color={signInWith === 'Google' ? 'purple' : 'green'}>{signInWith === 'Google' ? 'Google' : 'Padrão'}</Tag>
      ),
      filters: [
        { text: 'Padrão', value: 'Default' },
        { text: 'Google', value: 'Google' },
      ],
      onFilter: (value: any, record: UserModel) => record.signInWith === value,
      filterSearch: true,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      render: (type: string) => (
        <Tag color={type === 'Default' ? 'blue' : type === 'Admin' ? 'red' : type === 'Operator' ? 'geekblue' : type === 'Influencer' ? 'volcano' : 'green'}>
          {type === 'Default' ? 'Comum' : type === 'Admin' ? 'Administrador' : type === 'Operator' ? 'Operador' : type === 'Influencer' ? 'Influencer' : 'Agente'}
        </Tag>
      ),
      filters: [
        { text: 'Comum', value: 'Default' },
        { text: 'Administrador', value: 'Admin' },
        { text: 'Operador', value: 'Operator' },
        { text: 'Influencer', value: 'Influencer' },
        { text: 'Agente', value: 'Agent' },
      ],
      onFilter: (value: any, record: UserModel) => record.type === value,
      filterSearch: true,
    },
    {
      title: 'Data de nascimento',
      dataIndex: 'birthDate',
      render: (birthDate: string) => birthDate ? format(new Date(birthDate), 'dd/MM/yyyy', { locale: pt }) : 'N/A',
      align: 'center' as 'center',
      sorter: (a: any, b: any) => a.birthDate.localeCompare(b.birthDate),
    },
    {
      title: 'Data cadastro',
      dataIndex: 'createdAt',
      render: (createdAt: string) => createdAt ? format(new Date(createdAt), 'dd/MM/yyyy', { locale: pt }) : 'N/A',
      align: 'center' as 'center',
      sorter: (a: any, b: any) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: 'Alterado por',
      dataIndex: 'updatedBy',
      render: (updatedBy: string) => updatedBy ? updatedBy : 'N/A',
      align: 'center' as 'center',
      sorter: (a: any, b: any) => a.updatedBy.localeCompare(b.updatedBy),
    },
    {
      title: 'Data alteração',
      dataIndex: 'updatedAt',
      render: (updatedAt: string) => updatedAt ? format(new Date(updatedAt), 'dd/MM/yyyy', { locale: pt }) : 'N/A',
      align: 'center' as 'center',
      sorter: (a: any, b: any) => a.updatedAt.localeCompare(b.updatedAt),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'geekblue' : 'red'}>{isActive ? 'Ativo' : 'Inativo'}</Tag>
      ),
      align: 'center' as 'center',
      filters: [
        { text: 'Ativo', value: true },
        { text: 'Inativo', value: false },
      ],
      onFilter: (value: any, record: UserModel) => record.isActive === value,
      filterSearch: true,
    },
    {
      title: 'Ação',
      key: 'action',
      render: (record: UserModel) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <span className="material-symbols-outlined"
            onClick={() => handleEditClick(record)}
            style={{ cursor: 'pointer', fontSize: '20px', marginRight: '0.3rem' }}
            title='Editar'
          >
            edit
          </span>
          {record.isActive &&
            <span className="material-symbols-outlined"
              onClick={() => handleDeleteClick(record.id)}
              style={{ cursor: 'pointer', fontSize: '20px' }}
              title='Deletar'
            >
              delete
            </span>
          }
        </div>
      ),
      align: 'center' as 'center',
    },
  ];

  return (
    <Table
      className='custom-table'
      columns={columns}
      rowKey="id"
      dataSource={props.data}
      locale={{ emptyText: 'Nenhum dado disponível.' }}
      loading={props.isLoading}
      pagination={{
        current: currentPage,
        pageSize: itemsPerPage,
        total: props.data.length,
        onChange: (page, pageSize) => {
          setCurrentPage(page);
          setItemsPerPage(pageSize);
        },
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        locale: { items_per_page: ' itens' }
      }}
    />
  )
}

export default UserTable