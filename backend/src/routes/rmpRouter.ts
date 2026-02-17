import express from "express";
import { searchOneRMP } from "../controllers/searchOneRMP.js";

const router = express.Router();

router.get("/", searchOneRMP); // For single professor queries 

// router.get("/batch", searchBatchRMP);

export default router
