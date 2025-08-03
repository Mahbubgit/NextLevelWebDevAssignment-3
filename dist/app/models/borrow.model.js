"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrows = void 0;
const mongoose_1 = require("mongoose");
const book_model_1 = require("./book.model");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: "ObjectId",
        required: [true, "The book's ID must be entered!"],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, "Quantity can not be null!"],
        min: [1, "Quantity must be a positive number"],
    },
    dueDate: {
        type: Date,
        required: [true, "Due date must be entered."]
    }
}, {
    versionKey: false,
    timestamps: true
});
// Using a static method 
borrowSchema.static("isAvailable", function (book, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const borrowedBookId = yield book_model_1.Books.findById({ _id: book });
        const borrowedBookCopies = borrowedBookId === null || borrowedBookId === void 0 ? void 0 : borrowedBookId.copies;
        let remainingCopies = borrowedBookCopies - quantity;
        if (remainingCopies >= 0)
            return true;
        else
            return false;
    });
});
// Post Hook
borrowSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const borrowedBookId = yield book_model_1.Books.findById({ _id: doc.book });
            let remainingCopies = (borrowedBookId === null || borrowedBookId === void 0 ? void 0 : borrowedBookId.copies) - doc.quantity;
            // Update Book copies when Borrow a Book [When post a Borrow]
            if (remainingCopies > 0) {
                yield book_model_1.Books.findByIdAndUpdate(borrowedBookId, {
                    $set: {
                        copies: remainingCopies
                    }
                }, { new: true });
            }
            else if (remainingCopies == 0) { // Update Book copies to 0 and available status to false when remaining copies is equal to 0
                yield book_model_1.Books.findByIdAndUpdate(borrowedBookId, {
                    $set: {
                        copies: remainingCopies,
                        available: false
                    }
                }, { new: true });
            }
            next();
        }
        catch (error) {
            next(error);
            error;
        }
    });
});
exports.Borrows = (0, mongoose_1.model)("Borrows", borrowSchema);
