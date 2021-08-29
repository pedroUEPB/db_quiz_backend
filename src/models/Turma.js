const { Model, Sequelize } = require('sequelize');

class  Turma extends Model{
    static Init(sequelize){
        super.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Título da durma"
            },
            periode: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Não informado"
            }
        }, {
            sequelize
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'professor_id', as: 'user' });
        this.hasMany(models.TurmaAluno, { foreignKey: 'turma_id', as: 'alunos' });
        this.hasMany(models.QuizzTurma, { foreignKey: 'turma_id', as: 'entrega' });
    }
    
}

module.exports = Turma;