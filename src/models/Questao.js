const { Model, Sequelize } = require('sequelize');

class  Questao extends Model{
    static Init(sequelize){
        super.init({
            pergunta_texto: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            pergunta_img: {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            },
            resposta_correta: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: "questoes"
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.Quizz, { foreignKey: 'quizz_id', as: 'quizz' });
        this.hasMany(models.Resposta, { foreignKey: 'questao_id', as: 'respostas'});
    }
    
}

module.exports = Questao;