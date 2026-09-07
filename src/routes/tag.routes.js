import { Router } from "express";
import { body, param } from "express-validator";
import {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";
import { handleValidationErrors } from "../Middlewares/validate.middleware.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../Middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getTags);

router.post(
  "/",
  [
    authMiddleware,
    adminMiddleware,
    body("name")
      .isLength({ min: 2, max: 30 })
      .custom((val) => !/\s/.test(val)),
    handleValidationErrors,
  ],
  createTag,
);

router.get(
  "/:id",
  [
    authMiddleware,
    adminMiddleware,
    param("id").isInt(),
    handleValidationErrors,
  ],
  getTagById,
);
router.put(
  "/:id",
  [
    authMiddleware,
    adminMiddleware,
    param("id").isInt(),
    body("name")
      .isLength({ min: 2, max: 30 })
      .custom((val) => !/\s/.test(val)),
    handleValidationErrors,
  ],
  updateTag,
);
router.delete(
  "/:id",
  [
    authMiddleware,
    adminMiddleware,
    param("id").isInt(),
    handleValidationErrors,
  ],
  deleteTag,
);

export default router;
