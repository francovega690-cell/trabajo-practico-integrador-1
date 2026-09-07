import { User } from "./user.model.js";
import { Profile } from "./profile.model.js";
import { Article } from "./article.model.js";
import { Tag } from "./tag.model.js";
import { ArticleTag } from "./articleTag.model.js";

User.hasOne(Profile, {
  foreignKey: "userId",
  as: "profile",
  onDelete: "CASCADE",
});
Profile.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Article, {
  foreignKey: "userId",
  as: "articles",
  onDelete: "CASCADE",
});
Article.belongsTo(User, { foreignKey: "userId", as: "author" });

Article.belongsToMany(Tag, {
  through: ArticleTag,
  foreignKey: "articleId",
  otherKey: "tagId",
  as: "tags",
  onDelete: "CASCADE",
});
Tag.belongsToMany(Article, {
  through: ArticleTag,
  foreignKey: "tagId",
  otherKey: "articleId",
  as: "articles",
  onDelete: "CASCADE",
});

export { User, Profile, Article, Tag, ArticleTag };
