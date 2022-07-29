const { Model, Sequelize } = require('sequelize');

class  GroupAlumn extends Model{
    static Init(sequelize){
        super.init({
            //só para não ficar sem nada
            authorized: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        }, {
            sequelize,
        })
        return this;
    }

    static associate(models){
        this.belongsTo(models.Alumn, { foreignKey: 'alumn_id', as: 'alumn' })
        this.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' })
        this.hasMany(models.Answer, { foreignKey: 'group_alumn_id', as: 'answers'})
        this.hasMany(models.GroupAlumnQuiz, { foreignKey: 'group_alumn_id', as: 'finishedActivities'});
    }
    
}

module.exports = GroupAlumn;