import { Schema } from "mongoose";

// 1. Create an interface representing a document in MongoDB.

export interface User {
    username: string
    email: string
  }

// 2. Create a Schema corresponding to the document interface.

export const userSchema = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true }
});