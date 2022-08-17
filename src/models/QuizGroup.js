const { Model, Sequelize } = require('sequelize');

class  QuizGroup extends Model{
    static Init(sequelize){
        super.init({
            //data de entrega
            final_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'quiz_groups'
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
        this.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
    }
}

module.exports = QuizGroup;