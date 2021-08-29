const { Model, Sequelize } = require('sequelize');

class  User extends Model{
    static Init(sequelize){
        super.init({
            email: Sequelize.STRING,
            password: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            is_professor: {
                type: Sequelize.BOOLEAN,
                defaultValue: false, 
            },
            is_google_login:{
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_admin:{
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }
        }, {
            sequelize
        })
        return this;
    }
    static associate(models){
        this.hasOne(models.Professor, { foreignKey: 'id', as: 'professor'});
        this.hasOne(models.Admin, { foreignKey: 'id', as: 'admin'});
        this.hasOne(models.Aluno, { foreignKey: 'id', as: 'aluno'});
    }
}

module.exports = User;