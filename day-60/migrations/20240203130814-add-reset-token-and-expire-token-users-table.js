"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "reset_token", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("users", "expire_token", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "reset_token");
    await queryInterface.removeColumn("users", "expire_token");
  },
};
