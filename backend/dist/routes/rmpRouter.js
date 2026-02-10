import express from "express";
import { searchForRMP } from "../controllers/searchForRMP.js";
const router = express.Router();
router.get("/", searchForRMP);
export default router;
