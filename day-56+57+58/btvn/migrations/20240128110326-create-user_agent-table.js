"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_agent", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      device_type: {
        type: Sequelize.STRING,
      },
      os_name: {
        type: Sequelize.STRING,
      },
      client_name: {
        type: Sequelize.STRING,
      },
      logout_time: {
        type: Sequelize.DATE,
      },
      login_time: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      user_agent: {
        type: Sequelize.STRING,
      },
      is_logged_in: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_agent");
  },
};
