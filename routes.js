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
//OK
routes.post("/api/users/store", AuthController.store);
//OK
routes.post("/api/users/adminStore", verifyTokenAdmin, AuthController.storeAdmin);
//OK
routes.post("/api/login", AuthController.login);
//OK
routes.post("/api/users/verifPass/:id", verifyToken, AuthController.verifPass);
//OK
routes.put("/api/users/:id", UserController.updateUserPass);
//OK
routes.get("/api/users/:id", verifyTokenAuth, UserController.index);
//OK
routes.delete("/api/users/:id", verifyTokenAdmin, UserController.delete);


//professor
//OK
routes.put("/api/usersProfessor/:id", verifyToken, UserController.updateProfessor);

//aluno
//OK
routes.put("/api/usersAluno/:id", verifyToken, UserController.updateAluno);
//OK
routes.get("/api/alunos", verifyToken, UserController.getAlumns);

//admin
//OK
routes.get("/api/allUsers", verifyTokenAdmin, UserController.indexAll);
//OK
routes.get("/api/allQuiz", verifyTokenAdmin, QuizController.indexAllAdmin);
//ok
routes.get("/api/quizWithQuestions/:id", verifyTokenAdmin, QuizController.indexWithQuestions);
//OK
routes.get("/api/allGroups", verifyTokenAdmin, TurmaController.indexAllAdmin);
//OK
routes.post("/api/quiz", verifyTokenAdmin, QuizController.store);
//OK
routes.put("/api/usersAdmin/:id", verifyTokenAdmin, UserController.updateAdmin);

//rotas de contato
//OK
routes.post("/api/contato", EmailController.sendContact);

//rotas de convite
//OK
routes.post("/api/invite", verifyToken, EmailController.sendGroupInvitation);
//OK
routes.get("/api/allNotifications/:id", verifyTokenAuth, NotificationController.indexNotificationsAluno);
//OK
routes.delete("/api/accept_invite/:id", verifyToken, NotificationController.accept);
//OK
routes.delete("/api/notifications/:id", verifyToken, NotificationController.reject);
//OK
routes.post("/api/recoverAccount", EmailController.recover);

//rotas de quiz
//OK
routes.post("/api/quiz/:quiz_id/:group_id", verifyTokenAuth, QuizController.storeDateEntrega);
//OK
routes.post("/api/create_question", verifyTokenAdmin, QuizController.storeQuestion);
//OK
routes.put("/api/update_question", verifyTokenAdmin, QuizController.updateQuestion);
//ok
routes.get("/api/quiz/:id", verifyToken, QuizController.index);
//OK
routes.get("/api/quiz", verifyToken, QuizController.allActivities);
//OK
routes.get("/api/quiz_summary", verifyToken, QuizController.allActivitiesSummary);
//OK
routes.get("/api/quizAll/:group_id", verifyToken, QuizController.indexAll);
//OK
routes.get("/api/quiz_answers/:activity_id/:group_id", verifyToken, QuizController.indexQuestionsAnswers);
//OK
routes.put("/api/quizTurma/:id", verifyTokenAdmin, QuizController.updateQuizTurma);
//OK
routes.put("/api/quiz/:id", verifyTokenAdmin, QuizController.update);
//OK
routes.post("/api/quiz/answer", verifyToken, QuizController.storeAnswer);
//OK
routes.delete("/api/delete_question/:id", verifyTokenAdmin, QuizController.deleteQuestion);
//OK
routes.delete("/api/quiz/:id", verifyTokenAdmin, QuizController.delete);
//OK
routes.get("/api/general_statistics/:group_id/:activity_id", verifyToken, QuizController.getGeneralStatistics);
//OK
routes.get("/api/question", verifyToken, QuizController.getQuestion);

//rotas de turma
//OK
routes.post("/api/turmas", verifyToken, TurmaController.store);
//OK
routes.get("/api/turmas/:group_id", verifyToken, TurmaController.index);
//OK
routes.get("/api/teacher_groups/:id", verifyTokenAuth, TurmaController.teacherGroups);
//OK
routes.get("/api/alumnGroups/:id", verifyTokenAuth, TurmaController.indexAllAlumn);
//OK
routes.get("/api/alunoTurma/:id", verifyTokenAuth, TurmaController.indexAluno);
//OK
routes.get("/api/alumn_answers/:id", verifyToken, TurmaController.indexAnswers);
//OK
routes.get("/api/last_answer/:id/:quiz_id", verifyToken, TurmaController.lastAnswer);
//OK
routes.get("/api/alunoResults/:id", verifyToken, TurmaController.indexAlunoResults);
//OK
routes.delete("/api/turmas/:id", verifyToken, TurmaController.delete);
//OK
routes.delete("/api/turmas/deleteAluno/:id", verifyToken, TurmaController.deleteAluno);
//OK
routes.put("/api/turmas/:id", verifyToken, TurmaController.update);
//OK
routes.get("/api/finishedActivities/:id", verifyToken, TurmaController.getFinishedActivities);

module.exports = routes;