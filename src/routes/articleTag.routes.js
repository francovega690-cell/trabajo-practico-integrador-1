import { Router } from "express";
import { body, param } from "express-validator";
import {
  addTagToArticle,
  removeTagFromArticle,
} from "../controllers/articleTag.controller.js";
import { handleValidationErrors } from "../Middlewares/validate.middleware.js";
import { authMiddleware } from "../Middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  [body("articleId").isInt(), body("tagId").isInt(), handleValidationErrors],
  addTagToArticle,
);

router.delete(
  "/:articleTagId",
  [param("articleTagId").isInt(), handleValidationErrors],
  removeTagFromArticle,
);

export default router;
