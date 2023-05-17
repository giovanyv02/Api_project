'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkInsert(options, [
      {
        reviewId:1,
        url:"noonedotcom"
      },
      {
        reviewId:2,
        url:"notwodotcom"
      },
      {
        reviewId:3,
        url:"nothreedotcom"
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
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      url:{
        [Op.in]: ["noonedotcom","notwodotcom", "nothreedotcom"]
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
