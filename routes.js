const express = require("express");
const UserController = require("./src/controllers/UserController");
const AuthController = require("./src/controllers/AuthController");
const QuizzController = require("./src/controllers/QuizzController");
const TurmaController = require("./src/controllers/TurmaController");
const EmailController = require("./src/controllers/EmailController");
const NotificationController = require("./src/controllers/NotificationController");
const jwt = require("jsonwebtoken");
const TokenController = require("./src/controllers/TokenController");
const { verifyToken, verifyTokenAuth, verifyTokenAdmin } = require("./src/controllers/verifyToken");

const routes = express.Router();

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    //console.log("Token: " + token);
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({
          Status: "Token is not valid!, " + err
        });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

//rotas do usuário
routes.post("/api/users/store", AuthController.store);
routes.post("/api/users/adminStore", verifyTokenAdmin, AuthController.storeAdmin);
routes.post("/api/login", AuthController.login);
routes.post("/api/users/verifPass/:id", verifyToken, AuthController.verifPass);
routes.put("/api/users/:id", UserController.updateUserPass);
routes.get("/api/users/:id", verifyTokenAuth, UserController.index);
routes.delete("/api/users/:id", verifyTokenAdmin, UserController.delete);
//routes.post("/api/userPhoto", verifyToken, UserController.indexPhoto);


//professor
//routes.post("/api/professores", AuthController.storeProfessor);
routes.put("/api/usersProfessor/:id", verifyToken, UserController.updateProfessor);

//aluno
//routes.post("/api/alunos", AuthController.storeAluno);
routes.get("/api/alunos/result/:id", verifyTokenAuth, UserController.indexResult);
routes.put("/api/usersAluno/:id", verifyToken, UserController.updateAluno);
routes.get("/api/alunos/:email", verifyToken, UserController.userExist);

//admin
routes.get("/api/allUsers", verifyTokenAdmin, UserController.indexAll);
routes.get("/api/allQuiz", verifyTokenAdmin, QuizzController.indexAllAdmin);
routes.get("/api/allGroups", verifyTokenAdmin, TurmaController.indexAllAdmin);
routes.post("/api/quiz", verifyTokenAdmin, QuizzController.store);
routes.put("/api/usersAdmin/:id", verifyTokenAdmin, UserController.updateAdmin);

//rotas de contato
routes.post("/api/contato", EmailController.sendContact);

//rotas de convite
routes.post("/api/convite", verifyToken, EmailController.sendAlunoConvite);
routes.get("/api/allNotifications/:id", verifyTokenAuth, NotificationController.indexNotificationsAluno);
routes.get("/api/notifications/:id", verifyToken, NotificationController.index);
routes.get("/api/notification/:token/:id", NotificationController.indexOne);
routes.put("/api/notifications/:id", NotificationController.update);
routes.post("/api/recover", EmailController.recover);

//rotas de quizz
routes.post("/api/quizz/:quizz_id/:turma_id", verifyTokenAuth, QuizzController.storeDateEntrega);
routes.post("/api/quizz/questao", verifyTokenAdmin, QuizzController.storeQuestion);
routes.put("/api/quizz/questao/:question_id", verifyTokenAdmin, QuizzController.updateQuestion);
routes.get("/api/quizz/:id", verifyToken, QuizzController.index);
routes.get("/api/quiz", verifyTokenAuth, QuizzController.allActivities);
routes.get("/api/quizzAll/:turma_id", verifyToken, QuizzController.indexAll);
routes.get("/api/respostasQuiz/:quiz_id/:turma_id", verifyToken, QuizzController.indexQuizTurma);
routes.put("/api/quizTurma/:id", verifyTokenAdmin, QuizzController.updateQuizTurma);
routes.put("/api/quiz/:id", verifyTokenAdmin, QuizzController.update);
routes.post("/api/quizz/resposta", verifyToken, QuizzController.storeAnswer);
routes.delete("/api/quizz/questao/:id", verifyTokenAdmin, QuizzController.deleteQuestion);
routes.delete("/api/quizz/:id", verifyTokenAdmin, QuizzController.delete);

//rotas de turma
routes.post("/api/turmas", verifyToken, TurmaController.store);
routes.get("/api/turmas/:turma_id", verifyToken, TurmaController.index);
routes.get("/api/quizzTurma/:turma_id", verifyTokenAdmin, TurmaController.quizzTurma);
routes.get("/api/quizzTurma/:turma_id/:quizz_id", verifyToken, TurmaController.dataEntrega);
routes.get("/api/todasTurmas/:id", verifyTokenAuth, TurmaController.indexAll);
routes.get("/api/notasAluno/:id", verifyTokenAuth, TurmaController.indexAlunoWithNotas);
routes.get("/api/notas/:id/:quiz_id", verifyToken, TurmaController.indexRespostas);
routes.get("/api/alunoTurma/:id", verifyTokenAuth, TurmaController.indexAluno);
routes.get("/api/alunoResults/:id", verifyTokenAuth, TurmaController.indexAlunoResults);
routes.delete("/api/turmas/:id", verifyToken, TurmaController.delete);
routes.delete("/api/turmas/deleteAluno/:id", verifyToken, TurmaController.deleteAluno);
routes.put("/api/turmas/:id", verifyToken, TurmaController.update);
routes.put("/api/alunoTurma/:id", verifyTokenAuth, TurmaController.updateTurmaAluno);
routes.put("/api/alunoTurmaQuiz/:id", verifyToken, TurmaController.updateOrCreateFinishAct);

module.exports = routes;