const Quizz = require("../models/Quizz");
const Questao = require("../models/Questao");
const Resposta = require("../models/Resposta");
const QuizzTurma = require("../models/QuizzTurma");
const sequelize = require("sequelize");

module.exports = {
    //CREATE QUIZZ
    async store(req, res) {
        try{
            const quiz = req.body;
            if(quiz.questoes.length > 0){
                const quizz = await Quizz.create(quiz,{
                    include: {
                        association: 'questoes'
                    }
                });
                if(quizz){
                    return res.status(200).json({
                        Status: "Salvo!"
                    })
                }
                return res.status(200).json({
                    Status: "Não salvo!"
                })
            }
            const {questoes, ...other} = quiz;
            const quizz = await Quizz.create(other);
            if(quizz){
                return res.status(200).json({
                    Status: "Salvo!"
                })
            }
            return res.status(200).json({
                Status: "Não salvo!"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            });
        }
    },
    //UPDATE
    async update(req, res) {
        const { id } = req.params;
        const { title, quizz_img } = req.body;
        try{
            const quiz = await Quizz.findByPk(id);
            if(quiz){
                quiz.title = title;
                quiz.quizz_img = quizz_img;
                //quiz.previous_activity_id = previous_activity_id;
                await quiz.save();
                return res.status(200).json({
                    Status: "Activity updated!"
                })
            }
            return res.status(200).json({
                Status: "Activity not found!"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //CREATE QUESTION
    async storeQuestion(req, res) {
        const { quizz_id } = req.body;
        try{
            const quizz = await Quizz.findByPk(quizz_id);
            if(quizz){
               const question = await Questao.create(req.body);
               if(question){
                   quizz.question_count = quizz.question_count + 1;
                   await quizz.save();
                   return res.status(200).json(question);
               }
               return res.status(200).json({
                   Status: "Não foi possivel salvar"
               })
            }
            return res.status(200).json({
                Status: "Quizz não encontrado"
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //UPDATE QUESTION
    async updateQuestion(req, res) {
        const id = req.params.question_id;
        try{
            const question = await Questao.findByPk(id);
            if(question){
                const qst = req.body;
                const ret = await question.update(
                    {
                        pergunta_img: qst.pergunta_img, 
                        resposta_correta: qst.resposta_correta
                    }
                );
                if(ret){
                    return res.status(200).json(ret);
                }
                return res.status(200).json({
                    Status: "Question not updated!"
                })
            }
            return res.status(200).json({
                Status: "Question not found!"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async storeDateEntrega(req, res){
        const { quizz_id, turma_id } = req.params;
        const { data_entrega } = req.body;
        try{
            const quizz = await QuizzTurma.create({quizz_id: quizz_id, turma_id: turma_id, data_entrega: data_entrega});
            if(quizz) {
                return res.status(200).json({
                    Status: "Data alterada!",
                    quizz
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
    async index(req, res) {
        try{
            const { id } = req.params;
            const quiz = await Quizz.findByPk(id, {
                include: { 
                    association: 'questoes',
                },
                order: [["created_at", "ASC"]]
            });
            if(quiz){
                return res.status(200).json(quiz);
            }
            return res.status(200).json({
                Status: ["Quizz não encontrado"]
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    // gets an activity to quizDemo
    async indexQuizAluno(req, res){
        try{
            const { id, turma_aluno_id } = req.params;
            const quiz = await Quizz.findByPk(id, {
                include: {
                    association: 'questoes',
                    attributes: ['id'],
                    include: {
                        association: 'respostas',
                        attributes: ['turma_aluno_id'],
                        where: { turma_aluno_id: turma_aluno_id }
                    },
                    limit: 1
                },
                attributes: ['id', 'previous_activity_id', 'question_count', 'quizz_img', 'title']
            });
            if(quiz){
                return res.status(200).json(quiz)
            }
            return res.status(200).json({
                Status: "Atividade não encontrada!"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async allActivities(req, res){
        try{
            const activities = await Quizz.findAll();
            if(activities){
                return res.status(200).json({
                    activities
                })
            }
            return res.status(200).json({
                Status: "Nothing was found!"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async indexQuizTurma(req, res) {
        try{
            const { quiz_id, turma_id } = req.params;
            const quizz = await Quizz.findByPk(quiz_id, {
                attributes: [
                    'id', 
                    'previous_activity_id',
                    'question_count',
                    'title'/*,
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('questoes.respostas.resposta_questao'),
                                sequelize.col('questoes.resposta_correta'))
                        ), 
                        'hits'
                    ]*/
                ],
                include: {
                    association: 'questoes',
                    attributes: [
                        'id', 
                        'pergunta_img',
                        'resposta_correta'
                        /*,
                        [
                            sequelize.fn('SUM',
                                sequelize.where(
                                    sequelize.col('questoes.respostas.resposta_questao'),
                                    'A'
                                )
                            ),
                            'a_count'
                        ],
                        [
                            sequelize.fn('SUM',
                                sequelize.where(
                                    sequelize.col('questoes.respostas.resposta_questao'),
                                    'B'
                                )
                            ),
                            'b_count'
                        ],
                        [
                            sequelize.fn('SUM',
                                sequelize.where(
                                    sequelize.col('questoes.respostas.resposta_questao'),
                                    'C'
                                )
                            ),
                            'c_count'
                        ],
                        [
                            sequelize.fn('SUM',
                                sequelize.where(
                                    sequelize.col('questoes.respostas.resposta_questao'),
                                    'D'
                                )
                            ),
                            'd_count'
                        ]*/
                    ],
                    include: {
                        association: 'respostas',
                        attributes: [
                            'id',
                            'resposta_questao',
                        ],
                        include: {
                            association: 'aluno',
                            attributes: [
                                'id',
                                'turma_id'
                            ],
                            where: {turma_id: turma_id}
                        }
                    }
                }
            });
            if(quizz){
                return res.status(200).json(quizz);
            }
            return res.status(200).json({
                Status: ["Quizz não encontrado"]
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async indexQuestionsAnswers(req, res){
        try{
            const { quiz_id, turma_id } = req.params;
            const questions = await Questao.findAll({
                where: { quizz_id: quiz_id},
                attributes: [
                    'pergunta_img',
                    'resposta_correta',
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('respostas.resposta_questao'),
                                "A"
                            )
                        ), 
                        'a_count'
                    ],
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('respostas.resposta_questao'),
                                "B"
                            )
                        ), 
                        'b_count'
                    ],
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('respostas.resposta_questao'),
                                "C"
                            )
                        ), 
                        'c_count'
                    ],
                    [
                        sequelize.fn('SUM', 
                            sequelize.where(
                                sequelize.col('respostas.resposta_questao'),
                                "D"
                            )
                        ), 
                        'd_count'
                    ],
                ],
                include: {
                    association: 'respostas',
                    attributes: [],
                    include: {
                        association: 'aluno',
                        attributes: [],
                        where: { turma_id: turma_id }
                    }
                },
                group: ['id']
            });
            /*const answers = await Resposta.findAll({
                include: [
                    {
                        association: 'questao',
                        attributes: [
                            'id', 
                            'pergunta_img',
                            'resposta_correta',
                            [
                                sequelize.fn('SUM',
                                    sequelize.where(
                                        sequelize.col('Resposta.resposta_questao'),
                                        'A'
                                    )
                                ),
                                'a_count'
                            ],
                            [
                                sequelize.fn('SUM',
                                    sequelize.where(
                                        sequelize.col('Resposta.resposta_questao'),
                                        'B'
                                    )
                                ),
                                'b_count'
                            ],
                            [
                                sequelize.fn('SUM',
                                    sequelize.where(
                                        sequelize.col('Resposta.resposta_questao'),
                                        'C'
                                    )
                                ),
                                'c_count'
                            ],
                            [
                                sequelize.fn('SUM',
                                    sequelize.where(
                                        sequelize.col('Resposta.resposta_questao'),
                                        'D'
                                    )
                                ),
                                'd_count'
                            ]
                        ],
                        where: { quizz_id: quiz_id}
                    },
                    {
                        association: 'aluno',
                        attributes: ['id', 'turma_id'],
                        where: { turma_id: turma_id}
                    }
                ],
                attributes: [
                    'id', 
                    'resposta_questao'
                ]
            })*/
            return res.status(200).json(questions)
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async indexAll(req, res) {
        const { turma_id } = req.params;
        try{
            if(turma_id != 0){
                const quizz = await Quizz.findAll({
                    include: { 
                        association: 'entregas',
                        attributes: ['data_entrega'],
                        include: {
                            association: 'turma',
                            attributes: ['id'],
                            where: { id: turma_id }
                        }
                    }
                });
                if(quizz){
                    return res.status(200).json(quizz);
                }
            } else {
                const quizz = await Quizz.findAll();
                if(quizz){
                    return res.status(200).json(quizz);
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
    async indexAllAdmin(req, res){
        try{
            const activities = await Quizz.findAll({
                attributes: ['id', 'title', 'quizz_img']
            });
            return res.status(200).json(activities);
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async updateQuizTurma(req, res){
        const { id } = req.params;
        const { data_entrega } = req.body;
        try{
            let quizzDB = await QuizzTurma.findByPk(id);
            if(quizzDB){
                quizzDB.data_entrega = data_entrega;
                const result = await quizzDB.save();
                if(result){
                    return res.status(200).json({
                        Status: "Dados alterados",
                        result
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
    async storeAnswer(req, res){
        try {
            const resposta = await Resposta.create(req.body);
            if(resposta){
                return res.status(200).json({
                    Status: "Resposta salva",
                    resposta
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
    async deleteQuestion(req, res){
        const { id } = req.params;
        try{
            const question = await Questao.findByPk(id);
            if(question){
                const quizz = await Quizz.findByPk(question.quizz_id);
                const resQuestion = await question.destroy();
                if(resQuestion){
                    await quizz.update({question_count: quizz.question_count - 1});
                    return res.status(200).json({
                        Status: "Questao deletada"
                    });
                }
            }
            return res.status(200).json({
                Status: "Questão não encontrada"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async delete(req, res){
        const { id } = req.params;
        try{
            const quiz = await Quizz.findByPk(id);
            if(quiz){
                await quiz.destroy();
                return res.status(200).json({
                    Status: "Activity deleted!"
                })
            }
            return res.status(200).json({
                Status: "Activity not found!"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    }
}