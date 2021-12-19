import { Reply } from "src/app/models/replie.model";

export interface PostQuestionReplyDTO {
  questionId: string,
  reply: Reply
}
