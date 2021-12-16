import { Schema, model } from 'mongoose';
import mongoosastic from 'mongoosastic';
import { citySchema } from './city.model';

// 1. Create an interface representing a document in MongoDB.

export interface User {
  username: string
  email: string
}

export interface Reply {
  questionId: string
  content: string
  user: User
  createdAt: Date
}

export interface Question {
  title: string
  content: string
  city: string
  user: User
  createdAt: Date
  replies: Reply[]
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true }
});

const replaySchema = new Schema<Reply>({
  content: { type: String, required: true },
  user: { type: [userSchema], required: true },
  createdAt: { type: Date, required: true }
});

const schema = new Schema<Question>({
  title: { type: String, required: true, es_indexed: true },
  content: { type: String, required: true, es_indexed: true },
  city: {type: [citySchema], required: true, es_indexed: true },
  user: { type: [userSchema], required: true },
  createdAt: { type: Date, required: true, es_indexed: true },
  replies: {
    type:[replaySchema],
    es_indexed: true,
    es_type: 'nested',
    es_include_in_parent: true
  }
});

schema.plugin(mongoosastic);

// 3. Create a Model.
export const QuestionModel = model<Question>('Question', schema);