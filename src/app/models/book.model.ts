
import { model, Schema } from "mongoose";
import { IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook>({
    title: {
        type: String,
        required: [true, "The book's title can not be null!"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "The book's author can not be null!"],
        trim: true
    },
    genre: {
        type: String,
        uppercase: true,
        enum: {
            values: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
            message: "{VALUE} is not a valid genre. Please provide a valid genre."
        }
    },
    isbn: {
        type: String,
        required: [true, "ISBN can not be null!"],
        unique: [true, "This ISBN is already exist. Please provide another ISBN."],
    },
    description: {
        type: String,
    },
    copies: {
        type: Number,
        required: [true, "Copies can not be null!"],
        min: [1, "Copies must be a positive number"]
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
})


export const Books = model<IBook>("Books", bookSchema)