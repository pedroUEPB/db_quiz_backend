const express = require("express");
const UserController = require("./src/controllers/UserController");
const AuthController = require("./src/controllers/AuthController");
const QuizController = require("./src/controllers/QuizController");
const TurmaController = require("./src/controllers/TurmaController");
const EmailController = require("./src/controllers/EmailController");
const NotificationController = require("./src/controllers/NotificationController");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyTokenAuth, verifyTokenAdmin } = require("./src/controllers/verifyToken");

const routes = express.Router();

//rotas do usuário

routes.post("/api/users/store", AuthController.store);

routes.post("/api/users/adminStore", verifyTokenAdmin, AuthController.storeAdmin);

routes.post("/api/login", AuthController.login);

routes.post("/api/users/verifPass/:id", verifyToken, AuthController.verifPass);

routes.put("/api/users/:id", UserController.updateUserPass);

routes.get("/api/users/:id", verifyTokenAuth, UserController.index);

routes.delete("/api/users/:id", verifyTokenAdmin, UserController.delete);


//professor

routes.put("/api/usersProfessor/:id", verifyToken, UserController.updateProfessor);

//aluno

routes.put("/api/usersAluno/:id", verifyToken, UserController.updateAluno);

routes.get("/api/alunos", verifyToken, UserController.getAlumns);

//admin

routes.get("/api/allUsers", verifyTokenAdmin, UserController.indexAll);

routes.get("/api/allQuiz", verifyTokenAdmin, QuizController.indexAllAdmin);

routes.get("/api/quizWithQuestions/:id", verifyTokenAdmin, QuizController.indexWithQuestions);

routes.get("/api/allGroups", verifyTokenAdmin, TurmaController.indexAllAdmin);

routes.post("/api/quiz", verifyTokenAdmin, QuizController.store);

routes.put("/api/usersAdmin/:id", verifyTokenAdmin, UserController.updateAdmin);

//rotas de contato

routes.post("/api/contato", EmailController.sendContact);

//rotas de convite

routes.post("/api/invite", verifyToken, EmailController.sendGroupInvitation);

routes.get("/api/allNotifications/:id", verifyTokenAuth, NotificationController.indexNotificationsAluno);

routes.delete("/api/accept_invite/:id", verifyToken, NotificationController.accept);

routes.delete("/api/notifications/:id", verifyToken, NotificationController.reject);

routes.post("/api/recoverAccount", EmailController.recover);

//rotas de quiz

routes.post("/api/quiz/:quiz_id/:group_id", verifyToken, QuizController.storeDateEntrega);

routes.post("/api/create_question", verifyTokenAdmin, QuizController.storeQuestion);

routes.put("/api/update_question", verifyTokenAdmin, QuizController.updateQuestion);

routes.get("/api/quiz/:id", verifyToken, QuizController.index);

routes.get("/api/quiz", verifyToken, QuizController.allActivities);

routes.get("/api/quiz_summary/:group_id", verifyToken, QuizController.allActivitiesSummary);

routes.get("/api/quizAll/:group_id", verifyToken, QuizController.indexAll);

routes.get("/api/quiz_answers/:activity_id/:group_id", verifyToken, QuizController.indexQuestionsAnswers);

routes.put("/api/quizTurma/:id", verifyToken, QuizController.updateQuizTurma);

routes.put("/api/quiz/:id", verifyTokenAdmin, QuizController.update);

routes.post("/api/quiz/answer", verifyToken, QuizController.storeAnswer);

routes.delete("/api/delete_question/:id", verifyTokenAdmin, QuizController.deleteQuestion);

routes.delete("/api/quiz/:id", verifyTokenAdmin, QuizController.delete);

routes.get("/api/general_statistics/:group_id/:activity_id", verifyToken, QuizController.getGeneralStatistics);

routes.get("/api/question", verifyToken, QuizController.getQuestion);

//rotas de turma

routes.post("/api/turmas", verifyToken, TurmaController.store);

routes.get("/api/turmas/:group_id", verifyToken, TurmaController.index);

routes.get("/api/teacher_groups/:id", verifyTokenAuth, TurmaController.teacherGroups);

routes.get("/api/alumnGroups/:id", verifyTokenAuth, TurmaController.indexAllAlumn);

routes.get("/api/alunoTurma/:id", verifyTokenAuth, TurmaController.indexAluno);

routes.get("/api/alumn_answers/:id", verifyToken, TurmaController.indexAnswers);

routes.get("/api/last_answer/:id/:quiz_id", verifyToken, TurmaController.lastAnswer);

routes.get("/api/alunoResults/:id", verifyToken, TurmaController.indexAlunoResults);

routes.delete("/api/turmas/:id", verifyToken, TurmaController.delete);

routes.delete("/api/turmas/deleteAluno/:id", verifyToken, TurmaController.deleteAluno);

routes.put("/api/turmas/:id", verifyToken, TurmaController.update);

routes.get("/api/finishedActivities/:id", verifyToken, TurmaController.getFinishedActivities);

module.exports = routes;