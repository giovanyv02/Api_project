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
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-851950480167538672/original/0802a504-46df-438b-a0d7-69f220ff7803.jpeg?im_w=320",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/734ea6e8-cdb5-46fb-8585-79baab06d430.jpg?im_w=320",
        preview: false
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/3a168c9d-e142-4b07-b78f-ba4110e52efa.jpg?im_w=320",
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
