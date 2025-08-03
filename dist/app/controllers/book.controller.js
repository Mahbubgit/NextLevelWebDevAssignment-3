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
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const book_model_1 = require("../models/book.model");
exports.bookRoutes = express_1.default.Router();
const CreateBookZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    author: zod_1.default.string(),
    genre: zod_1.default.string(),
    isbn: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    copies: zod_1.default.number(),
    available: zod_1.default.boolean()
});
// Create Book
exports.bookRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zodBody = yield CreateBookZodSchema.parseAsync(req.body);
        const book = yield book_model_1.Books.create(zodBody);
        res.status(201).json({
            success: true,
            message: "Book Created Successfully",
            data: book
        });
    }
    catch (error) {
        res.status(400).json({
            message: error._message,
            success: false,
            error
        });
    }
}));
//Get All Books
exports.bookRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Filtering data
    const booksByFilter = req.query.filter ? req.query.filter : "";
    const sortByField = req.query.sortBy ? req.query.sortBy : "";
    const sortOrder = req.query.sort ? req.query.sort : "";
    const limitValue = req.query.limit ? req.query.limit : "";
    let books = [];
    if (booksByFilter && sortOrder == "asc") {
        books = yield book_model_1.Books.find({ genre: booksByFilter }).sort({ createdAt: 1 }).limit(parseInt(limitValue.toString()));
    }
    else if (booksByFilter && sortOrder == "desc") {
        books = yield book_model_1.Books.find({ genre: booksByFilter }).sort({ createdAt: -1 }).limit(parseInt(limitValue.toString()));
    }
    else {
        books = yield book_model_1.Books.find().sort({ createdAt: "asc" }).limit(10);
    }
    res.status(201).json({
        success: true,
        message: "Books retrieved Successfully",
        data: books
    });
}));
// Get Book by ID
exports.bookRoutes.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield book_model_1.Books.findById(bookId);
    res.status(201).json({
        success: true,
        message: "Book retrieved successfully",
        data: book
    });
}));
//Update Book
exports.bookRoutes.patch('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const updatedBody = req.body;
    const book = yield book_model_1.Books.findByIdAndUpdate(bookId, updatedBody, { new: true });
    res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data: book
    });
}));
//Delete Book
exports.bookRoutes.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const book = yield book_model_1.Books.findOneAndDelete({ _id: bookId });
    res.status(201).json({
        success: true,
        message: "Book deleted successfully",
        data: {}
    });
}));
