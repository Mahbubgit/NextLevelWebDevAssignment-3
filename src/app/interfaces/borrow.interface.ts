import mongoose, { Model, ObjectId } from "mongoose"
import { Date, Types } from "mongoose"

export interface IBorrow {
    book: ObjectId,
    quantity: number,
    dueDate: Date
}

export interface BorrowStaticMethods extends Model<IBorrow> {
    isAvailable(book: ObjectId, quantity: number): boolean
}