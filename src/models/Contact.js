const { Model, Sequelize } = require('sequelize');

class  Contact extends Model{
    static Init(sequelize){
        super.init({
            username: Sequelize.STRING,
	        email: Sequelize.STRING,
            subject: Sequelize.STRING,
            mensagem: Sequelize.STRING,
        }, {
            sequelize
        })
        return this;
    }
    
}

module.exports = Contact;