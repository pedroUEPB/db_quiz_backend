const express = require("express");
const UserController = require("./src/controllers/UserController");
const AuthController = require("./src/controllers/AuthController");
const QuizzController = require("./src/controllers/QuizzController");
const TurmaController = require("./src/controllers/TurmaController");
const EmailController = require("./src/controllers/EmailController");
const NotificationController = require("./src/controllers/NotificationController");

const routes = express.Router();

//rotas do usuário
routes.post("/api/login", AuthController.login);
routes.put("/api/users/:id", UserController.updateUserPass);

//professor
routes.post("/api/professores", AuthController.storeProfessor);
routes.put("/api/usersProfessor/:id", UserController.updateProfessor);

//aluno
routes.post("/api/alunos", AuthController.storeAluno);
routes.get("/api/alunos/result/:id", UserController.indexResult);

//admin
routes.post("/api/admin", AuthController.storeAdmin);
routes.put("/api/usersAluno/:id", UserController.updateAluno);

//routes.post("/api/register", AuthController.store);
//routes.get("/api/users", UserController.index);
//routes.delete("/api/users/:id", UserController.delete);

//rotas de contato
routes.post("/api/contato", EmailController.sendContact);

//rotas de convite
routes.post("/api/convite", EmailController.sendAlunoConvite);
routes.get("/api/allNotifications/:id", NotificationController.indexNotificationsAluno);
routes.get("/api/notifications/:id", NotificationController.index);
routes.get("/api/notification/:token/:id", NotificationController.indexOne);
routes.put("/api/notifications/:id", NotificationController.update);
routes.post("/api/recover", EmailController.recover);

//rotas de quizz
routes.post("/api/quizz", QuizzController.store);
routes.post("/api/quizz/:quizz_id/:turma_id", QuizzController.storeDateEntrega);
routes.post("/api/quizz/questao", QuizzController.storeQuestion);
routes.get("/api/quizz/:id", QuizzController.index);
routes.get("/api/quizzAll/:turma_id", QuizzController.indexAll);
routes.put("/api/quizz/:id", QuizzController.update);
routes.post("/api/quizz/resposta", QuizzController.storeAnswer);

//rotas de turma
routes.post("/api/turmas", TurmaController.store);
routes.get("/api/turmas/:turma_id", TurmaController.index);
routes.get("/api/quizzTurma/:turma_id", TurmaController.quizzTurma);
routes.get("/api/quizzTurma/:turma_id/:quizz_id", TurmaController.dataEntrega);
routes.get("/api/todasTurmas/:id", TurmaController.indexAll);
routes.get("/api/alunoTurma/:id", TurmaController.indexAluno);
routes.delete("/api/turmas/:id", TurmaController.delete);
routes.delete("/api/turmas/deleteAluno/:id", TurmaController.deleteAluno);
routes.put("/api/turmas/:id", TurmaController.update);
routes.put("/api/alunoTurma/:id", TurmaController.updateTurmaAluno);

module.exports = routes;