module.exports = {
    dialect: 'mysql',
    host: process.env.DB_URL,
    username: 'screen37_user',
    password: process.env.USER_PASSWORD,
    database: 'dbquizz',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};