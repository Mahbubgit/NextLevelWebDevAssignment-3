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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
const book_model_1 = require("../models/book.model");
exports.borrowRoutes = express_1.default.Router();
// To borrow a book
exports.borrowRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const borrowedBookId = yield book_model_1.Books.findById({ _id: body.book });
        // Validation whether quantity and due date are inputted
        if (!body.quantity || !body.dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Positive quantity and due date must be inputted!'
            });
        }
        else if (!((borrowedBookId === null || borrowedBookId === void 0 ? void 0 : borrowedBookId.copies) > 0)) //Verify the book has enough available copies
         {
            return res.status(400).json({
                success: false,
                message: 'Book copies are not available for borrow!'
            });
        }
        //*****Custom Static Method**************************
        const isAvailable = yield borrow_model_1.Borrows.isAvailable(body.book, body.quantity);
        if (isAvailable) {
            const borrow = yield borrow_model_1.Borrows.create(body);
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: borrow
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: `There is no enough copies available for book: ${borrowedBookId === null || borrowedBookId === void 0 ? void 0 : borrowedBookId.title}. 
            Requested Quantity: ${body.quantity}, Available Copies: ${borrowedBookId === null || borrowedBookId === void 0 ? void 0 : borrowedBookId.copies}`,
            });
        }
    }
    catch (error) {
        res.status(400).json({
            message: error._message,
            success: false,
            error
        });
    }
}));
// Borrowed Books Summary (Using Aggregation)
exports.borrowRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let borrowedBooks = [];
        borrowedBooks = yield borrow_model_1.Borrows.aggregate([
            {
                $facet: {
                    //pipeline-1
                    "book": [
                        {
                            $group: {
                                _id: "$book",
                            }
                        },
                    ],
                    //pipeline-2
                    "totalQuantity": [
                        {
                            $group: {
                                _id: "$book",
                                totalQuantity: { $sum: "$quantity" }
                            }
                        },
                    ],
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "book",
                    as: "book"
                }
            },
            {
                $unwind: "$book",
            },
            {
                $unwind: "$totalQuantity",
            },
            // {
            //     $match: {
            //         "totalQuantity._id": { $ne: ["book._id"] }, 
            //     }
            // },
            // {
            //     $match: {
            //         "book._id": new mongoose.Types.ObjectId("6884d9762626d2659ed3feee"),
            //6884d9762626d2659ed3feee, 6884d99d2626d2659ed3fef0, 6884d9c72626d2659ed3fef2
            //         // "totalQuantity.totalQuantity": 5,
            //         // "book.title": "The Theory of Everything",
            //         // "book._id" : "totalQuantity._id"
            //     }
            // },
            {
                $project: {
                    _id: 0,
                    // "book._id": 1,
                    "book.title": 1,
                    "book.isbn": 1,
                    // "book.copies": 1,
                    // "totalQuantity._id": 1,
                    // "totalQuantity.totalQuantity": 1,
                    "totalQuantity": "$totalQuantity.totalQuantity",
                },
            },
        ]);
        res.status(201).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrowedBooks
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve borrowed books summary.",
        });
    }
}));
