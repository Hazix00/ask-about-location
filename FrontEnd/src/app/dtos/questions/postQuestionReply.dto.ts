import { Reply } from "src/app/models/reply.model";

export interface PostQuestionReplyDTO {
  questionId: string,
  reply: {
    content: string
  }
}
