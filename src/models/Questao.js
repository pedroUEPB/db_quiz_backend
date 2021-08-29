const { Model, Sequelize } = require('sequelize');

class  Questao extends Model{
    static Init(sequelize){
        super.init({
            pergunta_texto: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            pergunta_img: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            resposta1: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "A",
            },
            resposta2: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "B",
            },
            resposta3: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "C",
            },
            resposta4: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "D",
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
        this.hasMany(models.Resposta, { foreignKey: 'questao_id', as: 'resposta_aluno'});
    }
    
}

module.exports = Questao;