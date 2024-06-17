import express from "express";
import { getBooks } from "../controllers/book.controller.js";

const router = express.Router();

router.get("/all-books", getBooks);

export default router;
