import { verifyToken } from "../helpers/jwt.helper.js";
import { User } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
  //para que no pueda acceder si no tiene el Token
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ message: "Acceso no autorizado. Token faltante." });
    //esto si el usuario es invalido
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "Usuario invalido." });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido o expirado." });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res
    .status(403)
    .json({ message: "Acceso denegado. Requiere permisos de admin." });
};
