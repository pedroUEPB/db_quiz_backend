const { Model, Sequelize } = require('sequelize');

class  Quizz extends Model{
    static Init(sequelize){
        super.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Título da atividade",
            },
            quizz_img: {
                type: Sequelize.BLOB('long'),
                allowNull: true
            },
            question_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            previous_activity_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        }, {
            sequelize
        })
        return this;
    }
    static associate(models){
        this.hasMany(models.Questao, { foreignKey: 'quizz_id', as: 'questoes' });
        this.hasMany(models.QuizzTurma, { foreignKey: 'quizz_id', as: 'entregas' });
    }
    
}

module.exports = Quizz;