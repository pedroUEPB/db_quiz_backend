const { Model, Sequelize } = require('sequelize');

class  TurmaAluno extends Model{
    static Init(sequelize){
        super.init({
            authorized: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            quizz1_finished: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            quizz2_finished: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            quizz3_finished: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            quizz4_finished: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            sequelize,
            tableName: 'turma-alunos'
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.Aluno, { foreignKey: 'aluno_id', as: 'aluno' })
        this.belongsTo(models.Turma, { foreignKey: 'turma_id', as: 'turma' })
        this.hasMany(models.Resposta, { foreignKey: 'turma_aluno_id', as: 'notas'})
    }
    
}

module.exports = TurmaAluno;