import { model, Schema } from "mongoose";
import { BorrowStaticMethods, IBorrow } from "../interfaces/borrow.interface";
import { Books } from "./book.model";

const borrowSchema = new Schema<IBorrow, BorrowStaticMethods>({
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
borrowSchema.static("isAvailable", async function (book, quantity) {
    const borrowedBookId = await Books.findById({ _id: book })
    const borrowedBookCopies: any = borrowedBookId?.copies;

    let remainingCopies = borrowedBookCopies - quantity;

    if (remainingCopies >= 0)
        return true
    else
        return false
});

// Post Hook
borrowSchema.post("save", async function (doc, next) {
    try {
        const borrowedBookId: any = await Books.findById({ _id: doc.book })
        let remainingCopies = borrowedBookId?.copies - doc.quantity;

        // Update Book copies when Borrow a Book [When post a Borrow]
        if (remainingCopies > 0) {
            await Books.findByIdAndUpdate(
                borrowedBookId,
                {
                    $set: {
                        copies: remainingCopies
                    }
                },
                { new: true }
            );
        } else if (remainingCopies == 0) {// Update Book copies to 0 and available status to false when remaining copies is equal to 0
            await Books.findByIdAndUpdate(
                borrowedBookId,
                {
                    $set: {
                        copies: remainingCopies,
                        available: false
                    }
                },
                { new: true }
            );
        }

        next();

    } catch (error: any) {
        next(error);
        error
    }
});

export const Borrows = model<IBorrow, BorrowStaticMethods>("Borrows", borrowSchema)