const { Model, Sequelize } = require('sequelize');

class  Resposta extends Model{
    static Init(sequelize){
        super.init({
            resposta_questao: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        }, {
            sequelize,
            tableName: 'respostas'
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.TurmaAluno, { foreignKey: 'turma_aluno_id', as: 'aluno' })
        this.belongsTo(models.Questao, { foreignKey: 'questao_id', as: 'questao' })
    }
    
}

module.exports = Resposta;