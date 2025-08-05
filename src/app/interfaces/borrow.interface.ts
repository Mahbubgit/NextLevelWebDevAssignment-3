import mongoose, { Model, ObjectId } from "mongoose"
import { Date, Types } from "mongoose"

export interface IBorrow {
    book: Types.ObjectId,
    // book: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'IBook'
    // }
    quantity: number,
    dueDate: Date
}

export interface BorrowStaticMethods extends Model<IBorrow> {
    isAvailable(book: Types.ObjectId, quantity: number): boolean
}