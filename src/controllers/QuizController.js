const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const QuizGroup = require("../models/QuizGroup");
const sequelize = require("sequelize");
const GroupAlumnQuiz = require("../models/GroupAlumnQuiz");
const { Op } = require("sequelize");

module.exports = {
    //CREATE QUIZZ
    //ok
    async store(req, res) {
        try{
            const quiz = req.body;
            const quizz = await Quiz.create(quiz);
            if(quizz){
                return res.status(200).json({
                    Status: "Activity created"
                })
            }
            return res.status(200).json({
                Status: "Activity not created"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            });
        }
    },
    //ok
    async update(req, res) {
        const { id } = req.params;
        //const { title, quiz_img } = req.body;
        try{
            const quiz = await Quiz.findByPk(id);
            if(quiz){
                await quiz.update(req.body);
                return res.status(200).json({
                    Status: "Activity updated"
                })
            }
            return res.status(200).json({
                Status: "Activity not found"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //CREATE QUESTION
    //ok
    async storeQuestion(req, res) {
        const { quiz_id } = req.body;
        try{
            const quizz = await Quiz.findByPk(quiz_id);
            if(quizz){
               const question = await Question.create(req.body);
               if(question){
                   await quizz.update({ question_count: quizz.question_count + 1 });
                   return res.status(200).json({
                    Status: "Question created"
                   });
               }
               return res.status(200).json({
                   Status: "Can't save the question"
               })
            }
            return res.status(200).json({
                Status: "Activity not found"
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //UPDATE QUESTION
    //ok
    async updateQuestion(req, res) {
        const id = req.body.id;
        try{
            const question = await Question.findByPk(id);
            if(question){
                const quest = await question.update(req.body);
                if(quest){
                    return res.status(200).json({
                        Status: "Question updated"
                    });
                }
                return res.status(200).json({
                    Status: "Question not updated"
                })
            }
            return res.status(200).json({
                Status: "Question not found"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async storeDateEntrega(req, res){
        const { quiz_id, group_id } = req.params;
        const { final_date, is_active } = req.body;
        try{
            const quiz = await QuizGroup.create({
                quiz_id: quiz_id, 
                group_id: group_id, 
                final_date,
                is_active
            });
            if(quiz) {
                return res.status(200).json({
                    Status: "Data alterada"
                })
            }
            return res.status(200).json({
                Status: "Erro ao salvar data"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async index(req, res) {
        try{
            const { id } = req.params;
            const quiz = await Quiz.findByPk(id, {
                attributes: ['id', 'title', 'question_count', 'previous_activity_id'],
                order: [["created_at", "ASC"]]
            });
            if(quiz){
                return res.status(200).json(quiz);
            }
            return res.status(200).json({
                Status: "Quiz não encontrado"
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async indexWithQuestions(req, res){
        try{
            const { id } = req.params;
            const quiz = await Quiz.findByPk(id, {
                attributes: ['id', 'title', 'quiz_img', 'question_count', 'previous_activity_id', 'is_active'],
                include: {
                    association: "questions",
                    attributes: ['id', 'question_text', 'answer_type', 'correct_answer', 'position'],
                    order: [["position", "ASC"]]
                },
                order: [["created_at", "ASC"]]
            });
            if(quiz){
                return res.status(200).json(quiz);
            }
            return res.status(200).json({
                Status: "Quiz não encontrado"
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async allActivities(req, res) {
        const group_id = req.query.group_id;
        try {
            const activities = await QuizGroup.findAll({
                where: { group_id: group_id, is_active: true },
                attributes: ['id', 'group_id', 'final_date', 'is_active'],
                include: {
                    association: 'quiz',
                    attributes: ['id', 'title', 'quiz_img', 'question_count', 'previous_activity_id'],
                    where: { is_active: true }
                }
            });
            if(activities){
                return res.status(200).json({
                    activities
                })
            }
            return res.status(200).json({
                Status: "Nenhuma atividade encontrada"
            })
        } catch(err) {
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    /*async allActivities(req, res){
        try{
            const activities = await Quiz.findAll({
                where: { is_active: true }
            });
            if(activities){
                return res.status(200).json({
                    activities
                })
            }
            return res.status(200).json({
                Status: "Nenhuma atividade encontrada"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },*/
    //ok
    async allActivitiesSummary(req, res){
        const { group_id } = req.params;
        try {
            const activities = await Quiz.findAll({
                attributes: ['id', 'title'],
                where: { is_active: true },
                include: {
                    association: 'entregas',
                    attributes: [],
                    where: { is_active: true, group_id}
                }
            });
            if(activities){
                return res.status(200).json({
                    activities
                })
            }
            return res.status(200).json({
                Status: "Nenhuma atividade encontrada"
            })
        } catch(err) {
            return res.status(200).json({
                Status: "Erro interno"
            })
        }
    },
    //ok
    async getGeneralStatistics(req, res){
        const { group_id, activity_id } = req.params;
        try{
            const statistics = await Question.findAll({
                where: { quiz_id: activity_id },
                attributes: [
                    [
                        sequelize.fn('SUM',
                            sequelize.where(
                                sequelize.col('answers.question_answer'),
                                sequelize.col('Question.correct_answer')
                            )
                        ),
                        'hits'
                    ],
                    [
                        sequelize.fn('COUNT',
                            sequelize.col('answers.id')
                        ),
                        'answers_count'
                    ],
                    [
                        sequelize.fn('SUM',
                            sequelize.where(
                                sequelize.col('answer_type'),
                                'open'
                            )
                        ),
                        'open_question_count'
                    ]
                ],
                include: {
                    association: 'answers',
                    attributes: [],
                    include: {
                        association: 'alumn',
                        attributes: [],
                        where: { group_id: group_id }
                    }
                }
            });
            return res.status(200).json(statistics);
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async getQuestion(req, res){
        const { position, activity_id, group_alumn_id } = req.query;
        try {
            const question = await Question.findOne({
                attributes: ['id', 'quiz_id', 'question_text', 'answer_type', 'position'],
                where: {
                    position: { 
                        [sequelize.Op.gt]: position
                    },
                    quiz_id: activity_id
                }
            });
            if(question){
                return res.status(200).json(question);
            }
            await GroupAlumnQuiz.create({
                quiz_id: activity_id,
                group_alumn_id: group_alumn_id,
                is_finished: true
            });
            return res.status(200).json({
                Status: "Nenhuma questão encontrada"
            })
        } catch(err) {
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async indexQuestionsAnswers(req, res){
        try{
            const { activity_id, group_id } = req.params;
            /*const questions = await Question.findAll({
                where: { quiz_id: activity_id},
                attributes: [
                    'question_text',
                    'correct_answer',
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('answers.question_answer'),
                                "A"
                            )
                        ), 
                        'a_count'
                    ],
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('answers.question_answer'),
                                "B"
                            )
                        ), 
                        'b_count'
                    ],
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('answers.question_answer'),
                                "C"
                            )
                        ), 
                        'c_count'
                    ],
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('answers.question_answer'),
                                "D"
                            )
                        ), 
                        'd_count'
                    ],
                ],
                include: {
                    association: 'answers',
                    attributes: [],
                    include: {
                        association: 'alumn',
                        attributes: [],
                        where: { group_id: group_id }
                    }
                },
                group: ['id']
            });*/
            const questions = await Question.findAll({
                where: { quiz_id: activity_id},
                attributes: [
                    'id',
                    'question_text',
                    'answer_type',
                    'correct_answer'
                ],
                include: {
                    association: 'answers',
                    attributes: ['question_answer'],
                    include: {
                        association: 'alumn',
                        attributes: [],
                        where: { group_id: group_id }
                    }
                },
            })
            return res.status(200).json(questions)
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async getActivitiesCount(req, res){
        const { type, group_id } = req.query;
        try {
            switch(type){
                case 'admin':
                    const countAdmin = await Quiz.count();
                    return res.status(200).json(countAdmin);
                case 'teacher':
                    const countTeacher = await Quiz.count({
                        where: { is_active: true }
                    });
                    return res.status(200).json(countTeacher);
                case 'alumn':
                    const countAlumn = await Quiz.count({
                        where: { is_active: true },
                        include: {
                            association: 'entregas',
                            attributes: [],
                            where: { is_active: true, group_id }
                        }
                    });
                    return res.status(200).json(countAlumn);
                    break;
                default:
                return res.status(200).json({
                    Status: "Não encontrado"
                })
            }
        } catch(err) {
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async indexAll(req, res) {
        const { last_id } = req.query;
        const { group_id } = req.params;
        try{
            if(group_id != 0){
                const quiz = await Quiz.findAll({
                    attributes: ['id', 'title', 'quiz_img', 'previous_activity_id', 'is_active'],
                    where: { 
                        is_active: true, 
                        id: { [Op.gt]: last_id }
                    },
                    include: { 
                        association: 'entregas',
                        attributes: ['id', 'final_date', 'is_active'],
                        include: {
                            association: 'group',
                            attributes: ['id'],
                            where: { id: group_id }
                        },
                    },
                    limit: 10
                });
                if(quiz){
                    return res.status(200).json(quiz);
                }
            } else {
                const quiz = await Quiz.findAll();
                if(quiz){
                    return res.status(200).json(quiz);
                }
            }
            return res.status(200).json({
                Status: "Não encontrado"
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async indexAllAlumn(req, res){
        const { group_alumn_id } = req.params;
        try{
            const activities = await Quiz.findAll({
                attributes: ['id', 'title', 'previous_activity_id', 'quiz_img'],
                include: {
                    association: "questions",
                    include: {
                        association: "answers",
                        attributes: ['id'],
                        where: { group_alumn_id: group_alumn_id },
                        limit: 1
                    },
                    attributes: ['id', 'quiz_id'],
                    limit: 1
                }
            });
            return res.status(200).json(activities);
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async indexAllAdmin(req, res){
        const { last_id } = req.query;
        try{
            const activities = await Quiz.findAll({
                attributes: ['id', 'title', 'quiz_img', 'is_active'],
                where: { 
                    id: { [Op.gt]: last_id }
                },
                limit: 10
            });
            return res.status(200).json(activities);
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async updateQuizTurma(req, res){
        const { id } = req.params;
        try{
            const quizDB = await QuizGroup.findByPk(id);
            if(quizDB){
                const result = await quizDB.update(req.body);
                if(result){
                    return res.status(200).json({
                        Status: "Dados alterados"
                    })
                }
            }
            return res.status(200).json({
                Status: "Erro ao salvar dados"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async storeAnswer(req, res){
        try {
            const resposta = await Answer.create(req.body);
            if(resposta){
                return res.status(200).json({
                    Status: "Resposta salva"
                })
            }
            return res.status(200).json({
                Status: "Erro ao salvar resposta"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async deleteQuestion(req, res){
        const { id } = req.params;
        try{
            const question = await Question.findByPk(id);
            if(question){
                const quizz = await Quiz.findByPk(question.quiz_id);
                const resQuestion = await question.destroy();
                if(resQuestion){
                    await quizz.update({question_count: quizz.question_count - 1});
                    return res.status(200).json({
                        Status: "Question removed"
                    });
                }
            }
            return res.status(200).json({
                Status: "Question not found"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async delete(req, res){
        const { id } = req.params;
        try{
            const quiz = await Quiz.findByPk(id);
            if(quiz){
                await quiz.destroy();
                return res.status(200).json({
                    Status: "Activity deleted"
                })
            }
            return res.status(200).json({
                Status: "Activity not found"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    }
}