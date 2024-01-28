"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mail_history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
