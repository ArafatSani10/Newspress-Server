import express from "express";
import { NewsController } from "./news.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.post("/create-news", auth(UserRole.ADMIN), NewsController.createNews);
router.get("/", NewsController.getAllNews);

router.get("/slug/:slug", NewsController.getSingleNews); 

router.patch("/update-news/:id", NewsController.updateNews);
router.delete("/:id", auth(UserRole.ADMIN), NewsController.deleteNews);

export const NewsRoutes: any = router;