"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        name: "Kiet Hoang",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("123123", 10),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await queryInterface.bulkInsert("users", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users");

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
