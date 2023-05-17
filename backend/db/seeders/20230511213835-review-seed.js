'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.bulkInsert(options,[
      {
        spotId:1,
        userId:1,
        review:"decent",
        stars:5
      },
      {
        spotId:2,
        userId:2,
        review:"hmmm it was okeu",
        stars:4
      },
      {
        spotId:3,
        userId:3,
        review:"bad",
        stars:3
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
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      stars:{
        [Op.in]: [5,4,3]
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
