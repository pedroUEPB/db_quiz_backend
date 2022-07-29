'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //locação de aluno em um grupo
    await queryInterface.createTable('group_alumns', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'groups', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      alumn_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'alumns', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      authorized: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('group_alumns');
  }
};
