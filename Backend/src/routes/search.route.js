import express from "express";
import { searchVideos } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/videos", searchVideos);

export default router;
