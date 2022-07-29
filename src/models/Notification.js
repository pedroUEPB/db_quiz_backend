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
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' })
    }
    
}

module.exports = Notification;