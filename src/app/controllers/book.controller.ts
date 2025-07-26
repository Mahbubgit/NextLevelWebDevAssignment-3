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

// Create Book
bookRoutes.post('/', async (req: Request, res: Response) => {

    try {
        const zodBody = await CreateBookZodSchema.parseAsync(req.body)
        const book = await Books.create(zodBody);

        res.status(201).json({
            success: true,
            message: "Book Created Successfully",
            data: book
        })
    } catch (error: any) {
        res.status(400).json({
            message: error._message,
            success: false,
            error
        })
    }
}
)

//Get All Books
bookRoutes.get('/', async (req: Request, res: Response) => {

    //Filtering data
    const booksByFilter = req.query.filter ? req.query.filter : ""
    const sortByField = req.query.sortBy ? req.query.sortBy : ""
    const sortOrder = req.query.sort ? req.query.sort : ""
    const limitValue = req.query.limit ? req.query.limit : ""

    let books = []

    if (booksByFilter && sortOrder == "asc") {
        books = await Books.find({ genre: booksByFilter }).sort({ createdAt: 1 }).limit(parseInt(limitValue.toString()));
    } else if (booksByFilter && sortOrder == "desc") {
        books = await Books.find({ genre: booksByFilter }).sort({ createdAt: -1 }).limit(parseInt(limitValue.toString()));
    } else {
        books = await Books.find().sort({ createdAt: "asc" }).limit(10);
    }

    res.status(201).json({
        success: true,
        message: "Books retrieved Successfully",
        data: books
    })
});


// Get Book by ID
bookRoutes.get('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId;

    const book = await Books.findById(bookId);

    res.status(201).json({
        success: true,
        message: "Book retrieved successfully",
        data: book
    })
});

//Update Book
bookRoutes.patch('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId;
    const updatedBody = req.body;
    const book = await Books.findByIdAndUpdate(bookId, updatedBody, { new: true });

    res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data: book
    })
});

//Delete Book
bookRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    const bookId = req.params.bookId;
    const book = await Books.findOneAndDelete({ _id: bookId });

    res.status(201).json({
        success: true,
        message: "Book deleted successfully",
        data: {}
    })
})