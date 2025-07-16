import express, { Request, Response } from "express";
import z, { int32 } from "zod";
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
        const book = await Books.create(zodBody);

        //....Built in and custom instance methods....
        // const body = req.body
        // const book = new Books(body);
        // await book.save();

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

//To Get All Books
bookRoutes.get('/', async (req: Request, res: Response) => {

    //Filtering data

    const booksByFilter = req.query.filter ? req.query.filter : ""
    const sortByField = req.query.sortBy ? req.query.sortBy : ""
    const sortOrder = req.query.sort ? req.query.sort : ""
    const limitValue = req.query.limit ? req.query.limit : ""

    console.log(booksByFilter, "sortBy", sortByField, sortOrder, "limit", parseInt(limitValue.toString()));

    let books = []


    if (booksByFilter && sortOrder == "asc") {
        books = await Books.find({ genre: booksByFilter }).sort({ createdAt: 1 }).limit(parseInt(limitValue.toString()));
    } else if (booksByFilter && sortOrder == "desc") {
        books = await Books.find({ genre: booksByFilter }).sort({ createdAt: -1 }).limit(parseInt(limitValue.toString()));
    } else {
        books = await Books.find({ genre: "asc" }).sort({ createdAt: "asc" }).limit(10);
    }

    res.status(201).json({
        success: true,
        message: "Books retrieved Successfully",
        data: books
    })
});