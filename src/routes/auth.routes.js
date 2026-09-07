import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { handleValidationErrors } from "../Middlewares/validate.middleware.js";
import { authMiddleware } from "../Middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("username").isAlphanumeric().isLength({ min: 3, max: 20 }),
    body("email").isEmail(),
    body("password").isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
    }),
    body("firstName").isAlpha().isLength({ min: 2, max: 50 }),
    body("lastName").isAlpha().isLength({ min: 2, max: 50 }),
    body("biography").optional().isLength({ max: 500 }),
    body("avatarUrl").optional().isURL(),
    handleValidationErrors,
  ],
  register,
);

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
    handleValidationErrors,
  ],
  login,
);

router.get("/profile", authMiddleware, getProfile);

router.put(
  "/profile",
  [
    authMiddleware,
    body("firstName").optional().isAlpha().isLength({ min: 2, max: 50 }),
    body("lastName").optional().isAlpha().isLength({ min: 2, max: 50 }),
    body("biography").optional().isLength({ max: 500 }),
    body("avatarUrl").optional().isURL(),
    handleValidationErrors,
  ],
  updateProfile,
);

router.post("/logout", authMiddleware, logout);

export default router;
