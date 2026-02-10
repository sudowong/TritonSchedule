import express from "express";
import { searchForClass } from "../controllers/searchForClass.js";

const router = express.Router();

router.get("/", searchForClass) // For search bar class querying

export default router
