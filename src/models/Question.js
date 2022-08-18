const { Model, Sequelize } = require('sequelize');

class  Question extends Model{
    static Init(sequelize){
        super.init({
            question_text: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            question_img: {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            },
            answer_type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            correct_answer: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            position: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: "questions"
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
        this.hasMany(models.Answer, { foreignKey: 'question_id', as: 'answers'});
    }
    
}

module.exports = Question;