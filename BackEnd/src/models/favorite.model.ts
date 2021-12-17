import { Schema, model } from 'mongoose';
import mongoosastic from 'mongoosastic'

// 1. Create an interface representing a document in MongoDB.

export interface Favorite {
  username: string
  createdAt: Date
  favoriteQuestionIds: string[]
}

// 2. Create a Schema corresponding to the document interface.

export const citySchema = new Schema({
  username: { type: String, es_indexed: true },
  createdAt: { type: Date, es_indexed: true },
  favoriteQuestionsIds : { type: [String] , es_indexed: true },
})

citySchema.plugin(mongoosastic)

// 3. Create a Model.
export const FavoriteModel = model('Favorite', citySchema);