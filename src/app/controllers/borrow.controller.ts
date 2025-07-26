import express, { Request, Response } from "express";
import { Borrows } from "../models/borrow.model";
import { Books } from "../models/book.model";

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
