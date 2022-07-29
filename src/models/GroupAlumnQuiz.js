const { Model, Sequelize } = require('sequelize');

class  GroupAlumnQuiz extends Model{
    static Init(sequelize){
        super.init({
            is_finished: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            sequelize,
            tableName: 'group_alumn_quizes'
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.GroupAlumn, { foreignKey: 'group_alumn_id', as: 'group_alumn' });
        this.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
    }
}

module.exports = GroupAlumnQuiz;