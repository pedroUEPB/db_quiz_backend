'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('questoes', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      quizz_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'quizzs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      pergunta_texto:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      pergunta_img:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      resposta1:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      resposta2:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      resposta3:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      resposta4:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      resposta_correta:{
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('questoes');
  }
};
