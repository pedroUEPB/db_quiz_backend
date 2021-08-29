const { Model, Sequelize } = require('sequelize');

class  Contato extends Model{
    static Init(sequelize){
        super.init({
            username: Sequelize.STRING,
	        email: Sequelize.STRING,
            assunto: Sequelize.STRING,
            mensagem: Sequelize.STRING,
        }, {
            sequelize
        })
        return this;
    }
    
}

module.exports = Contato;