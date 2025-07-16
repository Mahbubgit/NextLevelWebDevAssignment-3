import express, { Request, Response } from "express";
import z from "zod";
import { Books } from "../models/book.model";

export const bookRoutes = express.Router();

const CreateBookZodSchema = z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    isbn: z.string(),
    description: z.string().optional(),
    copies: z.number(),
    available: z.boolean()
});

// To create a book
bookRoutes.post('/', async (req: Request, res: Response) => {

    try {
        const zodBody = await CreateBookZodSchema.parseAsync(req.body)
        // console.log(zodBody, "zod body");
        // const book = await Books.create(zodBody);


        //....Built in and custom instance methods....
        // const body = req.body

        const book = new Books(zodBody);

        await book.save();

        res.status(201).json({
            success: true,
            message: "Book Created Successfully",
            data: book
        })
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
            error
        })
    }
}
)