const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");

const User = require("../models/User");
const Professor = require("../models/Professor");
const Aluno = require("../models/Aluno");
const Contato = require("../models/Contato");
const Quizz = require("../models/Quizz");
const Turma = require("../models/Turma");
const Notification = require("../models/Notification");
const TurmaAluno = require("../models/TurmaAluno");
const Admin = require("../models/Admin");
const Questao = require("../models/Questao");
const Resposta = require("../models/Resposta");
const QuizzTurma = require("../models/QuizzTurma");
const RefreshToken = require("../models/RefreshToken");
const Turma_Aluno_Quiz = require("../models/TurmaAlunoQuiz");

const connection = new Sequelize(dbConfig);

User.Init(connection);
Professor.Init(connection);
Aluno.Init(connection);
Admin.Init(connection);
Contato.Init(connection);
Quizz.Init(connection);
Turma.Init(connection);
Notification.Init(connection);
TurmaAluno.Init(connection);
Questao.Init(connection);
Resposta.Init(connection);
QuizzTurma.Init(connection);
Turma_Aluno_Quiz.Init(connection);
RefreshToken.Init(connection);

User.associate(connection.models);
Professor.associate(connection.models);
Aluno.associate(connection.models);
Admin.associate(connection.models);
Quizz.associate(connection.models);
Turma.associate(connection.models);
Notification.associate(connection.models);
TurmaAluno.associate(connection.models);
Questao.associate(connection.models);
Resposta.associate(connection.models);
QuizzTurma.associate(connection.models);
Turma_Aluno_Quiz.associate(connection.models);

module.exports = connection;