module.exports = {
    dialect: 'mysql',
    host: process.env.DB_URL,
    username: 'screen37_acesso',
    password: process.env.USER_PASSWORD,
    database: 'screen37_db_quiz',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};