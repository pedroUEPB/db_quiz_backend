const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database_dev");

const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Alumn = require("../models/Alumn");
const Contact = require("../models/Contact");
const Quiz = require("../models/Quiz");
const Group = require("../models/Group");
const Notification = require("../models/Notification");
const GroupAlumn = require("../models/GroupAlumn");
const Admin = require("../models/Admin");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const QuizGroup = require("../models/QuizGroup");
const Group_Alumn_Quiz = require("../models/GroupAlumnQuiz");

const connection = new Sequelize(dbConfig);

User.Init(connection);
Teacher.Init(connection);
Alumn.Init(connection);
Admin.Init(connection);
Contact.Init(connection);
Quiz.Init(connection);
Group.Init(connection);
Notification.Init(connection);
GroupAlumn.Init(connection);
Question.Init(connection);
Answer.Init(connection);
QuizGroup.Init(connection);
Group_Alumn_Quiz.Init(connection);

User.associate(connection.models);
Teacher.associate(connection.models);
Alumn.associate(connection.models);
Admin.associate(connection.models);
Quiz.associate(connection.models);
Group.associate(connection.models);
Notification.associate(connection.models);
GroupAlumn.associate(connection.models);
Question.associate(connection.models);
Answer.associate(connection.models);
QuizGroup.associate(connection.models);
Group_Alumn_Quiz.associate(connection.models);

module.exports = connection;