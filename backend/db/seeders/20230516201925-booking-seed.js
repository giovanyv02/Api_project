'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkInsert(options,[
      {
        spotId: 1,
        userId: 1,
        startDate: "2023-12-01",
        endDate: "2023-12-04",
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2024-12-01",
        endDate: "2024-12-04",
      },
      {
        spotId:3,
        userId: 3,
        startDate: "2027-12-14",
        endDate: "2027-12-19",
      },
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
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      startDate:{
        [Op.in]: ["2023-12-01", "2024-12-01", "2027-12-14"]
      }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
