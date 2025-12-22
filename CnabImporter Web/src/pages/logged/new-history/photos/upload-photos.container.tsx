import { BookModel } from "../../../../common/models/book.model"
import { PlanModel } from "../../../../common/models/plan.model"
import { QuestionUserAnswerModel } from "../../../../common/models/question-user-answer.model"
import { QuestionModel } from "../../../../common/models/question.model"

import UploadPhotosForm from "./upload-photos.form"
import './upload-photos.scss'

export interface UploadPhotosContainerProps {
  book: BookModel
  questionAnsewers: QuestionUserAnswerModel[];
  plan: PlanModel;
  question: QuestionModel;
  closeModal(questionUserAnswer: QuestionUserAnswerModel): void;
}
const UploadPhotosContainer = (props: UploadPhotosContainerProps) => {

  return (
    <div className="row containerPhoto">
      <div className="col-12">
        <UploadPhotosForm closeModal={props.closeModal}
          questionAnswers={props.questionAnsewers}
          plan={props.plan}
          question={props.question}
        />
      </div>
    </div>
  )
}
export default UploadPhotosContainer