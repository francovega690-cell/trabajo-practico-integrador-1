import { Tag, Article } from "../models/index.js";

export const createTag = async (req, res) => {
  try {
    const tag = await Tag.create({ name: req.body.name });
    return res.status(201).json(tag);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al crear la etiqueta.", error: error.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    return res.status(200).json(tags);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al listar etiquetas.", error: error.message });
  }
};

export const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        { model: Article, as: "articles", through: { attributes: [] } },
      ],
    });
    if (!tag)
      return res.status(404).json({ message: "Etiqueta no encontrada." });
    return res.status(200).json(tag);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener etiqueta.", error: error.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag)
      return res.status(404).json({ message: "Etiqueta no encontrada." });

    await tag.update({ name: req.body.name });
    return res
      .status(200)
      .json({ message: "Etiqueta actualizada exitosamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar etiqueta.", error: error.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag)
      return res.status(404).json({ message: "Etiqueta no encontrada." });

    await tag.destroy();
    return res.status(200).json({ message: "Etiqueta eliminada con exito." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar etiqueta.", error: error.message });
  }
};
