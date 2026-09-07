import { User, Profile } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export const register = async (req, res) => {
  try {
    // desestructuramos y si existe el gmail, el mensage es ya esta registrado
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      biography,
      avatarUrl,
      birthDate,
    } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "El email ya esta registrado." });

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    await Profile.create({
      userId: newUser.id,
      firstName,
      lastName,
      biography,
      avatarUrl,
      birthDate,
    });

    return res
      .status(201)
      .json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Credenciales invalidas." });
    }
    // pienso que una hora es poco, asi que dije vamos a ponerle un dia
    const token = generateToken({ id: user.id, role: user.role });
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(200).json({ message: "Login exitoso.", role: user.role });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Profile, as: "profile" }],
    });
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener perfil.", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile)
      return res.status(404).json({ message: "Perfil no encontrado." });

    await profile.update(req.body);
    return res
      .status(200)
      .json({ message: "Perfil actualizado exitosamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar perfil.", error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Sesion cerrada exitosamente." });
};
