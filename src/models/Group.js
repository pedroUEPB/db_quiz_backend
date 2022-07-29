const { Model, Sequelize } = require('sequelize');

class  Group extends Model{
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
            },
            alumn_count: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            }
        }, {
            sequelize
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.Teacher, { foreignKey: 'teacher_id', as: 'teacher' });
        this.hasMany(models.GroupAlumn, { foreignKey: 'group_id', as: 'alumns' });
        //data de entrega das atividades
        this.hasMany(models.QuizGroup, { foreignKey: 'group_id', as: 'dates' });
    }
    
}

module.exports = Group;