import { Article, Tag, User } from "../models/index.js";

export const createArticle = async (req, res) => {
  try {
    const article = await Article.create({ ...req.body, userId: req.user.id });
    return res.status(201).json(article);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al crear articulo.", error: error.message });
  }
};

export const getPublishedArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { status: "published" },
      include: [
        { model: User, as: "author", attributes: ["id", "username"] },
        { model: Tag, as: "tags", through: { attributes: [] } },
      ],
    });
    return res.status(200).json(articles);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener articulos.", error: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        { model: User, as: "author", attributes: ["id", "username"] },
        { model: Tag, as: "tags", through: { attributes: [] } },
      ],
    });
    if (!article)
      return res.status(404).json({ message: "Articulo no encontrado." });
    return res.status(200).json(article);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar articulo.", error: error.message });
  }
};

export const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { userId: req.user.id },
      include: [{ model: Tag, as: "tags", through: { attributes: [] } }],
    });
    return res.status(200).json(articles);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al obtener articulos propios.",
        error: error.message,
      });
  }
};

export const getMyArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Tag, as: "tags", through: { attributes: [] } }],
    });
    if (!article)
      return res
        .status(404)
        .json({ message: "Articulo no encontrado o no pertenece al usuario." });
    return res.status(200).json(article);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar articulo.", error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Articulo no encontrado." });

    if (article.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para modificar este articulo." });
    }

    await article.update(req.body);
    return res.status(200).json({ message: "Articulo actualizado con exito." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar articulo.", error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Articulo no encontrado." });

    if (article.userId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar este articulo." });
    }
    // otra vez, esto es eliminacion logica
    await article.destroy();
    return res.status(200).json({ message: "Articulo eliminado logicamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar articulo.", error: error.message });
  }
};
