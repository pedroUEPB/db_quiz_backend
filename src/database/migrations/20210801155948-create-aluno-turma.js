'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('turma-alunos', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      turma_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'turmas', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'alunos', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      authorized:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      quizz1_finished:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      quizz2_finished:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      quizz3_finished:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      quizz4_finished:{
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('turma-alunos');
  }
};
