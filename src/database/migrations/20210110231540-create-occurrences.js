'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Occurrences', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.DATE
      },
      family: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      nature: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      municipality: {
        type: Sequelize.STRING
      },
      parish: {
        type: Sequelize.STRING
      },
      town: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      operatives: {
        type: Sequelize.INTEGER
      },
      ground: {
        type: Sequelize.INTEGER
      },
      aerial: {
        type: Sequelize.INTEGER
      },
      aerialOperatives: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Occurrences');
  }
};