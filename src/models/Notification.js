const { Model, Sequelize } = require('sequelize');

class  Notification extends Model{
    static Init(sequelize){
        super.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Não informado",
            }, 
            message: {
                type: Sequelize.STRING,
                allowNull: false
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

module.exports = Notification;