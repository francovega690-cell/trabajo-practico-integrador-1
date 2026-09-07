import { User, Profile, Article } from "../models/index.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: Profile, as: "profile" }],
    });
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al listar usuarios.", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Profile, as: "profile" },
        { model: Article, as: "articles" },
      ],
    });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar usuario.", error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName,
      biography,
      avatarUrl,
      birthDate,
    } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await Profile.create({
      userId: user.id,
      firstName,
      lastName,
      biography,
      avatarUrl,
      birthDate,
    });

    return res
      .status(201)
      .json({ message: "Usuario creado por administrador." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al crear usuario.", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });

    if (req.body.password)
      req.body.password = await hashPassword(req.body.password);
    await user.update(req.body);
    return res.status(200).json({ message: "Usuario actualizado." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar usuario.", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado." });
    // esto es la eliminacion logica profe
    await user.destroy();
    return res.status(200).json({ message: "Usuario eliminado logicamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar usuario.", error: error.message });
  }
};
