const { Model, Sequelize } = require('sequelize');

class  Professor extends Model{
    static Init(sequelize){
        super.init({
            matricula: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            register_finished: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: false,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            profile_picture:{
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: "noAvatar.png"
            },
            birthday: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            periode: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            city:{
              type: Sequelize.STRING,
              allowNull: true,
            },
            state: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            institute: {
              type: Sequelize.STRING,
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

module.exports = Professor;