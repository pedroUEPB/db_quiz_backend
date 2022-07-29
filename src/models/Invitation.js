const { Model, Sequelize } = require('sequelize');

class  Invitation extends Model{
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
        this.belongsTo(models.Alumn, { foreignKey: 'alumn_id', as: 'alumn' })
        this.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' })
    }
    
}

module.exports = Invitation;