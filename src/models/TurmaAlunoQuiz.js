const { Model, Sequelize } = require('sequelize');

class  TurmaAlunoQuiz extends Model{
    static Init(sequelize){
        super.init({
            is_finished: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            sequelize,
            tableName: 'turma_aluno_quizes'
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.TurmaAluno, { foreignKey: 'turma_aluno_id', as: 'turma_aluno' });
        this.belongsTo(models.Quizz, { foreignKey: 'quiz_id', as: 'quiz' });
    }
}

module.exports = TurmaAlunoQuiz;