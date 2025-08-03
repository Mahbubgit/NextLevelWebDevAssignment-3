"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
        min: [0, "Copies must be a positive number"]
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});
exports.Books = (0, mongoose_1.model)("Books", bookSchema);
