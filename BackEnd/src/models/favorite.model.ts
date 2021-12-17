import { Schema, model, SchemaTypes } from 'mongoose';
import mongoosastic from 'mongoosastic'
import { User, userSchema } from './user.schema';

// 1. Create an interface representing a document in MongoDB.

export interface Favorite {
  id: string
  user: User
  favoriteQuestionsIds: string[]
}

// 2. Create a Schema corresponding to the document interface.

const favoriteQuestionSchema = new Schema({
  questionId: { type: SchemaTypes.ObjectId, required: true },
  createdAt: { type: Date, required: true },
});

export const citySchema = new Schema({
  user: { type: userSchema, required: true, es_type: 'nested', es_indexed: true },
  createdAt: { type: Date, es_indexed: true },
  favoriteQuestionsIds : { type: [favoriteQuestionSchema] ,es_type: 'nested', es_indexed: true, es_include_in_parent: true },
})

citySchema.plugin(mongoosastic)

// 3. Create a Model.
export const FavoriteModel = model('Favorite', citySchema);