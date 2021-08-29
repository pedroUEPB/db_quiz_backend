const { Model, Sequelize } = require('sequelize');

class  QuizzTurma extends Model{
    static Init(sequelize){
        super.init({
            data_entrega: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'quizz-turmas'
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.Turma, { foreignKey: 'turma_id', as: 'turma' });
        this.belongsTo(models.Quizz, { foreignKey: 'quizz_id', as: 'quizz' });
    }
}

module.exports = QuizzTurma;