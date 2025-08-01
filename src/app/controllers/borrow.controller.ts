import express, { Request, Response } from "express";
import { Borrows } from "../models/borrow.model";
import { Books } from "../models/book.model";
import mongoose from "mongoose";

export const borrowRoutes = express.Router();

// To borrow a book
borrowRoutes.post('/', async (req: Request, res: Response) => {

    try {
        const body = req.body;
        const borrowedBookId: any = await Books.findById({ _id: body.book })

        // Validation whether quantity and due date are inputted
        if (!body.quantity || !body.dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Positive quantity and due date must be inputted!'
            });
        } else if (!(borrowedBookId?.copies > 0)) //Verify the book has enough available copies
        {
            return res.status(400).json({
                success: false,
                message: 'Book copies are not available for borrow!'
            });
        }

        //*****Custom Static Method**************************

        const isAvailable = await Borrows.isAvailable(body.book, body.quantity)

        if (isAvailable) {
            const borrow = await Borrows.create(body);

            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: borrow
            })
        } else {
            res.status(400).json({
                success: false,
                message: `There is no enough copies available for book: ${borrowedBookId?.title}. 
            Requested Quantity: ${body.quantity}, Available Copies: ${borrowedBookId?.copies}`,
            })
        }
    } catch (error: any) {
        res.status(400).json({
            message: error._message,
            success: false,
            error
        })
    }

});

// Borrowed Books Summary (Using Aggregation)

borrowRoutes.get('/', async (req: Request, res: Response) => {
    try {
        let borrowedBooks = [];

        borrowedBooks = await Borrows.aggregate([

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

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve borrowed books summary.",
        });
    }
})