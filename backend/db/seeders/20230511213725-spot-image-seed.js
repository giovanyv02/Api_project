'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "lalalanddotcom",
        preview: true
      },
      {
        spotId: 2,
        url: "lalalanddotcom",
        preview: false
      },
      {
        spotId: 3,
        url: "lalalanddotcom",
        preview: true
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
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      url:{ [Op.in]: ['lalalanddotcom'] }
    },{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
