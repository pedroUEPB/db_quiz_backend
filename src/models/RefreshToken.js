const { Model, Sequelize } = require('sequelize');

class  RefreshToken extends Model{
    static Init(sequelize){
        super.init({
            refresh_token:{
                type: Sequelize.STRING,
                allowNull: false,
            }
        }, {
            sequelize
        })
        return this;
    }
    
}

module.exports = RefreshToken;