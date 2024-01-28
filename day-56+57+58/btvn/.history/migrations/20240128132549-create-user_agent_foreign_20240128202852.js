"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("user_agent", {
      name: "user_agent_user_id_foreign",
      type: "foreign key",
      fields: ["user_id"],
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "user_agent",
      "user_agent_user_id_foreign"
    );
  },
};
