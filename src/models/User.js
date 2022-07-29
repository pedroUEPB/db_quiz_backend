const { Model, Sequelize } = require('sequelize');

class  User extends Model{
    static Init(sequelize){
        super.init({
            email: Sequelize.STRING,
            password: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            is_admin:{
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_teacher: {
                type: Sequelize.BOOLEAN,
                defaultValue: false, 
            },
            is_google_login:{
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            form_clicked:{
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }
        }, {
            sequelize
        })
        return this;
    }
    static associate(models){
        this.hasOne(models.Teacher, { foreignKey: 'id', as: 'teacher'});
        this.hasOne(models.Admin, { foreignKey: 'id', as: 'admin'});
        this.hasOne(models.Alumn, { foreignKey: 'id', as: 'alumn'});
    }
}

module.exports = User;