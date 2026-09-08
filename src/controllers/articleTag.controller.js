import { Article, Tag, ArticleTag } from "../models/index.js";

export const addTagToArticle = async (req, res) => {
  try {
    const { articleId, tagId } = req.body;
    const article = await Article.findByPk(articleId);
    if (!article)
      return res.status(404).json({ message: "Articulo no encontrado." });
    if (article.userId !== req.user.id)
      return res.status(403).json({ message: "No sos el autor del articulo." });

    const tag = await Tag.findByPk(tagId);
    if (!tag)
      return res.status(404).json({ message: "Etiqueta no encontrada." });

    const relation = await ArticleTag.create({ articleId, tagId });
    return res
      .status(201)
      .json({ message: "Etiqueta asociada al articulo.", relation });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al asociar etiqueta.", error: error.message });
  }
};

export const removeTagFromArticle = async (req, res) => {
  try {
    const { articleTagId } = req.params;
    const relation = await ArticleTag.findByPk(articleTagId);
    if (!relation)
      return res.status(404).json({ message: "Relacion no encontrada." });

    const article = await Article.findByPk(relation.articleId);
    if (article.userId !== req.user.id)
      return res.status(403).json({ message: "No sos el autor del articulo." });

    await relation.destroy();
    return res.status(200).json({ message: "Etiqueta removida del articulo." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al remover etiqueta.", error: error.message });
  }
};
