import { Router } from "express";
import { body, param } from "express-validator";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { handleValidationErrors } from "../Middlewares/validate.middleware.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../Middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getUsers);
router.get("/:id", [param("id").isInt(), handleValidationErrors], getUserById);

router.post(
  "/",
  [
    body("username").isAlphanumeric().isLength({ min: 3, max: 20 }),
    body("email").isEmail(),
    body("password").isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
    }),
    body("role").isIn(["user", "admin"]),
    body("firstName").isAlpha().isLength({ min: 2, max: 50 }),
    body("lastName").isAlpha().isLength({ min: 2, max: 50 }),
    handleValidationErrors,
  ],
  createUser,
);

router.put(
  "/:id",
  [
    param("id").isInt(),
    body("username").optional().isAlphanumeric().isLength({ min: 3, max: 20 }),
    body("email").optional().isEmail(),
    body("role").optional().isIn(["user", "admin"]),
    handleValidationErrors,
  ],
  updateUser,
);

router.delete(
  "/:id",
  [param("id").isInt(), handleValidationErrors],
  deleteUser,
);

export default router;
