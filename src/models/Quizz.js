const { Model, Sequelize } = require('sequelize');

class  Quizz extends Model{
    static Init(sequelize){
        super.init({
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "tipo de habilidade",
            },
            quizz_img: {
                type: Sequelize.STRING,
                defaultValue: "no_img.png",
            },
            question_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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