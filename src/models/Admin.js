const { Model, Sequelize } = require('sequelize');

class  Admin extends Model{
    static Init(sequelize){
        super.init({
            username: Sequelize.STRING,
            profile_picture:{
                type: Sequelize.BLOB('long'),
                allowNull: true,
            }
        }, {
            sequelize
        })
        return this;
    }
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'id', as: 'user' })
    }
    
}

module.exports = Admin;