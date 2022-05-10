module.exports = {
    dialect: 'mysql',
    //production
    host: process.env.DB_URL,
    username: 'screen37_acesso',
    password: process.env.USER_PASSWORD,
    database: 'screen37_db_quiz',
    //develepment
    /*host: 'localhost',
    username: 'root',
    password: '',
    database: 'dbquizz',*/
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};