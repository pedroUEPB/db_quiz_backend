const { Model, Sequelize } = require('sequelize');

class  Convite extends Model{
    static Init(sequelize){
        super.init({
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Aberto",
            }
        }, {
            sequelize
        })
        return this;
    }
    static associate(models){
        this.belongsTo(models.Aluno, { foreignKey: 'aluno_id', as: 'aluno' })
        this.belongsTo(models.Turma, { foreignKey: 'turma_id', as: 'turma' })
    }
    
}

module.exports = Convite;