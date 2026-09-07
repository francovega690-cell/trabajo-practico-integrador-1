import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Profile = sequelize.define(
  "Profile",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      field: "user_id",
    },

    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "first_name",
    },

    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "last_name",
    },

    biography: { type: DataTypes.TEXT, allowNull: true },
    avatarUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "avatar_url",
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "birth_date",
    },
  },
  { tableName: "profiles" },
);
