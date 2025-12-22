import { Table } from 'antd';
import { QuestionModel } from '../../../../common/models/question.model';
import { useState } from 'react';
import { BookViewerNavigate } from './upload-photos.form';

interface PhotoQuestionTableProps {
    data: BookViewerNavigate[],
    isLoading: boolean,
    handlerCheckQuestion:(capitulo:QuestionModel,checked:boolean)=>void
  }

const PhotoQuestionTable =(props:PhotoQuestionTableProps)=>{

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const columns = [
        {
          title: "Capítulo",
          dataIndex: "chapter",
          sorter: (a: any, b: any) => a.title.localeCompare(b.chapter),
        },
        {
          title: "Sub-título",
          dataIndex: "subject",
          sorter: (a: any, b: any) => a.title.localeCompare(b.subject),
        },
        {
          title: "Ação",
          key: "action",
          render: (record: QuestionModel) => (
            <div>
               <input type='radio' name='rad'  onChange={(e)=> props.handlerCheckQuestion(record,e.target.checked)}  ></input>
            </div>
          ),
          align: "center" as "center",
        },
      ];

    return(
        <>
         <Table
            className='custom-table'
            rowKey="id"
            dataSource={props.data}

            columns={columns}
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
        </>
    )
}
export default PhotoQuestionTable