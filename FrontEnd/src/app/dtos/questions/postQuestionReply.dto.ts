import { Reply } from "src/app/models/replies.model";

export interface PostQuestionReplyDTO {
  questionId: string,
  reply: Reply
}
