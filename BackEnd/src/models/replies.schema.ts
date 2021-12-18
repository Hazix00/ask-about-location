import { Schema } from "mongoose";
import { User, userSchema } from "./user.schema";

// 1. Create an interface representing a document in MongoDB.

export interface Reply {
    content: string
    user: User
    createdAt: Date
}

// 2. Create a Schema corresponding to the document interface.

export const replySchema = new Schema<Reply>({
    content: { type: String, required: true },
    // @ts-ignore
    user: { type: userSchema, required: true },
    createdAt: { type: Date, required: true }
});