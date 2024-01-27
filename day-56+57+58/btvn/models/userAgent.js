"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserAgent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserAgent.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  UserAgent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      device_type: {
        type: DataTypes.STRING,
      },
      os_name: {
        type: DataTypes.STRING,
      },
      client_name: {
        type: DataTypes.STRING,
      },
      login_time: {
        type: DataTypes.STRING,
      },
      logout_time: {
        type: DataTypes.STRING,
      },
      user_agent: {
        type: DataTypes.STRING,
      },
      is_logged_in: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "UserAgent",
      tableName: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UserAgent;
};
