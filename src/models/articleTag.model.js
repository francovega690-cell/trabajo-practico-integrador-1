import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ArticleTag = sequelize.define(
  "ArticleTag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "article_id",
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "tag_id",
    },
  },
  { tableName: "articles_tags" },
);
