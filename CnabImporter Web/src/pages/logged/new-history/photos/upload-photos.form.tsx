import { useForm } from "react-hook-form";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";

import { QuestionModel } from "../../../../common/models/question.model";
import { QuestionUserAnswerModel } from "../../../../common/models/question-user-answer.model";
import { PlanModel } from "../../../../common/models/plan.model";
import { QuestionService } from "../../../../common/http/api/questionService";
import { AuthenticatedUserModel } from "../../../../common/models/authenticated.model";

import { Loader, Uploader } from "rsuite";
import "rsuite/Uploader/styles/index.css";

import CustomTextArea from "../../../../components/forms/customTextArea/customTextArea.component";

export interface UploadPhotosFormProps {
  questionAnswers: QuestionUserAnswerModel[];
  plan: PlanModel;
  question: QuestionModel;
  closeModal(questionUserAnswer: QuestionUserAnswerModel): void;
}

export interface BookViewerNavigate {
  idChapter: number;
  chapter: string;
  answer: string;
  subject?: string;
  idQuestionUserAnwers: number;
}

const UploadPhotosForm = (props: UploadPhotosFormProps) => {
  const [isLoading, setIsloading] = useState(false);
  const [inactivationModalOpen, setInactivationModalOpen] = useState(false);
  const _questionService = new QuestionService();
  const [urlPostPhoto, setUrlPostPhoto] = useState("");
  const user = AuthenticatedUserModel.fromLocalStorage();
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  //@ts-ignore
  const [userQuestionSelected, setUserQuestionSelected] =useState<QuestionUserAnswerModel>(null);

  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getUserAnwer();
  }, []);

  const getUserAnwer = () => {
    if (!props.question?.questionUserAnswers?.length) return;

    setIsloading(true);
    _questionService
      .getQuestionUserAnwerById(props.question.questionUserAnswers![0].id)
      .then((response: any) => {
        setUserQuestionSelected(response);
        setValue("caption", response.imagePhotoLabel);
        setUrlPostPhoto(
          `${import.meta.env.VITE_BASE_URL}questions/upload-photo/${response.id}`,
        );
      })
      .catch((e) => {
        //@ts-ignore
        let message = "Error ao obter dados de participante.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  const handlerDeletePhoto = () => {
    updatePhoto(true);
  };

  const updatePhoto = async (removePhoto: boolean) => {
    let data: QuestionUserAnswerModel = {
      ...userQuestionSelected,
      imagePhotoUrl: removePhoto ? "" : userQuestionSelected.imagePhotoUrl,
      imagePhotoLabel: watch("caption"),
    };

    setInactivationModalOpen(false);
    setIsloading(true);

    await _questionService
      .updatePhotoQuestionUserAnswer(data)
      .then(() => {
        setValue("caption", "");
      })
      .catch((e) => {
        let message = "Error ao obter dados de participante.";
        if (e.response?.data?.length > 0 && e.response.data[0].message)
          message = e.response.data[0].message;
        if (e.response?.data?.detail) message = e.response?.data?.detail;
        console.log("Erro: ", message, e);
      })
      .finally(() => {
        setIsloading(false);
        props.closeModal(data);
      });
  };

  function previewFile(file: any, callback: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <span>
        Sub-titulo - <strong>{props.question?.subject}</strong>
      </span>
      <br></br>
      <span>{props.question?.title}</span>
      <div className="row rowTopUpload border-top mt-3 pt-3">
        <div className=" mt-2 text-center">
          <Uploader headers={{ authorization: 'Bearer ' + user?.token }}
            locale={{ error: 'Erro', clear: 'Limpar', loading: 'Carregando', remove: 'Remover', emptyMessage: 'Sem mensagem' }}
            listType="picture"
            action={urlPostPhoto}
            fileListVisible={false}
            onUpload={(file) => {
              setUploading(true);
              previewFile(file.blobFile, (value: SetStateAction<null>) => {
                setFileInfo(value);
              });
            }}
            onSuccess={(response) => {
              setUploading(false);
              getUserAnwer();
              toast.success("Foto salva com sucesso", {
                position: "top-center",
                style: { width: 450 },
              });
              console.log(response);
            }}
            onError={() => {
              setFileInfo(null);
              setUploading(false);
              toast.error("Erro ao salvar a foto", {
                position: "top-center",
                style: { width: 450 },
              });
            }}
          >
            <button style={{ width: 300, height: 220 }}>
              {uploading && <Loader backdrop center />}
              {fileInfo || userQuestionSelected?.imagePhotoUrl ? (
                <img
                  width={250}
                  className="img-fluid img-thumbnail "
                  src={fileInfo || userQuestionSelected?.imagePhotoUrl}
                  alt={"Photo"}
                />
              ) : (
                <FontAwesomeIcon icon={faCameraRetro} />
              )}
            </button>
          </Uploader>
          {(fileInfo || userQuestionSelected?.imagePhotoUrl) && (
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => setInactivationModalOpen(true)}
              className="mx-2 text-primary"
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      </div>
      <div className="row mt-2 text-end">
        <div className="col-12 ">
          <CustomTextArea
            type="text"
            rows={3}
            label="Legenda foto"
            placeholder="Legenda foto"
            register={register}
            errors={errors.title}
            name="caption"
            setValue={setValue}
            divClassName="col-12 "
            validationSchema={{
              maxLength: {
                value: 200,
                message: "Legenda foto deve conter no máximo 200 caracteres",
              },
            }}
            maxLength={200}
          />
        </div>
        <small>
          <span>{watch("caption")?.length ?? 0}/200</span>
        </small>
        <div className="col-12 text-end mt-2">
          <button
            className="btn btn-primary text-white rounded-4 f-14 px-4 py-2"
            type="submit"
            onClick={() => updatePhoto(false)}
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
      </div>

      <Modal
        show={inactivationModalOpen}
        onHide={() => setInactivationModalOpen(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você tem certeza que deseja excluir a foto?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn border-1 rounded-5 f-14 px-4 py-2"
            style={{ border: "1px solid #dee2e6" }}
            onClick={() => setInactivationModalOpen(false)}
          >
            Não
          </button>
          <button
            className="btn btn-primary text-white rounded-5 f-14 px-4 py-2"
            onClick={handlerDeletePhoto}
          >
            Sim
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadPhotosForm;
