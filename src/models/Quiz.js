const { Model, Sequelize } = require('sequelize');

class  Quiz extends Model{
    static Init(sequelize){
        super.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Título da atividade",
            },
            quiz_img: {
                type: Sequelize.BLOB('long'),
                allowNull: true
            },
            question_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: true
            },
            previous_activity_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: "quizes"
        })
        return this;
    }
    static associate(models){
        this.hasMany(models.Question, { foreignKey: 'quiz_id', as: 'questions' });
        this.hasMany(models.QuizGroup, { foreignKey: 'quiz_id', as: 'entregas' });
    }
    
}

module.exports = Quiz;