const { Model, Sequelize } = require('sequelize');

class  TurmaAluno extends Model{
    static Init(sequelize){
        super.init({
            authorized: {
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
        this.hasMany(models.TurmaAlunoQuiz, { foreignKey: 'turma_aluno_id', as: 'finishedActivities'});
    }
    
}

module.exports = TurmaAluno;