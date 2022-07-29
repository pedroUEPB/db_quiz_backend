const { Model, Sequelize } = require('sequelize');

class  Answer extends Model{
    static Init(sequelize){
        super.init({
            question_answer: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        }, {
            sequelize,
            tableName: 'answers'
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.GroupAlumn, { foreignKey: 'group_alumn_id', as: 'alumn' })
        this.belongsTo(models.Question, { foreignKey: 'question_id', as: 'question' })
    }
    
}

module.exports = Answer;