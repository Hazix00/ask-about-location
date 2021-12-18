import { Schema, model } from 'mongoose';
//@ts-ignore
import mongoosastic from 'mongoosastic';
import { City, citySchema } from './city.model';
import { User, userSchema } from './user.schema';
import { Reply, replySchema } from './replies.schema';

// 1. Create an interface representing a document in MongoDB.

export interface Question {
  id: string
  title: string
  content: string
  city: City
  user: User
  createdAt: Date
  replies: Reply[]
}

// 2. Create a Schema corresponding to the document interface.

const schema = new Schema({
  title: { type: String, required: true, es_indexed: true },
  content: { type: String, required: true, es_indexed: true },
  // @ts-ignore
  city: {type: citySchema, required: true,es_type: 'nested', es_indexed: true },
  // @ts-ignore
  user: { type: userSchema, required: true, es_type: 'nested', es_indexed: true },
  createdAt: { type: Date, required: true, es_indexed: true },
  replies: {
    type:[replySchema],
    es_indexed: true,
    es_type: 'nested',
    es_include_in_parent: true
  }
});

schema.plugin(mongoosastic);

// 3. Create a Model.
export const QuestionModel = model('Question', schema);