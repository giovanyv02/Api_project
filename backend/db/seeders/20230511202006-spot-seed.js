'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.bulkInsert(options, [
      {
        ownerId:1,
        address: "23 new york",
        city: "Alabama",
        state:"Boston",
        country:"Mexico",
        lat: 23.8,
        lng: 32.6,
        name: "biggi",
        description: "best house in town",
        price: 5.99
      },
      {
        ownerId:2,
        address: "24 new jersey",
        city: "Canada",
        state:"leogane",
        country:"peru",
        lat: 24.8,
        lng: 33.6,
        name: "nicy",
        description: "come and stay with us",
        price: 5.98
      },
      {
        ownerId:3,
        address: "23 old york",
        city: "Florida",
        state:"USA",
        country:"Miami",
        lat: 21.8,
        lng: 31.6,
        name: "cooly",
        description: "best spot ever",
        price: 5.96
      }
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      price:{
        [Op.in]: [5.99, 5.98, 5.96]
      }
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
