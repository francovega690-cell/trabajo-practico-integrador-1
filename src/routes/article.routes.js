import { Router } from "express";
import { body, param } from "express-validator";
import {
  createArticle,
  getPublishedArticles,
  getArticleById,
  getMyArticles,
  getMyArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { handleValidationErrors } from "../Middlewares/validate.middleware.js";
import { authMiddleware } from "../Middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getPublishedArticles);
router.get("/user", getMyArticles);
router.get(
  "/user/:id",
  [param("id").isInt(), handleValidationErrors],
  getMyArticleById,
);
router.get(
  "/:id",
  [param("id").isInt(), handleValidationErrors],
  getArticleById,
);

router.post(
  "/",
  [
    body("title").isLength({ min: 3, max: 200 }),
    body("content").isLength({ min: 50 }),
    body("excerpt").optional().isLength({ max: 500 }),
    body("status").optional().isIn(["published", "archived"]),
    handleValidationErrors,
  ],
  createArticle,
);

router.put(
  "/:id",
  [
    param("id").isInt(),
    body("title").optional().isLength({ min: 3, max: 200 }),
    body("content").optional().isLength({ min: 50 }),
    body("status").optional().isIn(["published", "archived"]),
    handleValidationErrors,
  ],
  updateArticle,
);

router.delete(
  "/:id",
  [param("id").isInt(), handleValidationErrors],
  deleteArticle,
);

export default router;
