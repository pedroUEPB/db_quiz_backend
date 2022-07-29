const Group = require("../models/Group");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const Alumn = require("../models/Alumn");
const GroupAlumn = require("../models/GroupAlumn");
const QuizGroup = require("../models/QuizGroup");
const Answer = require("../models/Answer");
const GroupAlumnQuiz = require("../models/GroupAlumnQuiz");
const Quiz = require("../models/Quiz");
//const { sequelize } = require("../models/Turma");
const sequelize = require("sequelize");

module.exports = {
    //create
    //ok
    async store(req, res){
        const { teacher_id } = req.body;
        try{
            const professor = await User.findByPk(teacher_id);
            if(professor){
                if(professor.is_teacher){
                    const turma = await Group.create(req.body);
                    if(!turma){
                        return res.status(200).json({
                            Status: "Não foi possível salvar"
                        })
                    }
                    return res.status(200).json({
                        Status: "Grupo criado com sucesso"
                    });
                }
                return res.status(200).json({
                    Status: "É necessário ser professor"
                })
            }
            return res.status(200).json({
                Status: "Usuário não cadastrado"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno"
            })
        }
    },
    //teacher groups
    //ok
    async teacherGroups(req, res){
        const id = req.params.id;
        try{
            const professor = await Teacher.findByPk(id);
            if(professor){
                const turmas = await Group.findAll({ 
                    where: {teacher_id: professor.id} 
                })
                if(turmas){
                    return res.status(200).json(turmas);
                }
                return res.status(400).json({
                    Status: "Nenhuma turma encontrada"
                })
            }
            return res.status(400).json({
                Status: "Professor não encontrado"
            })
        } catch(err){
            return res.status(400).json({
                Status: "Erro ao procurar turmas"
            })
        }
    },
    //Alumn groups
    //ok
    async indexAllAlumn(req, res){
        //id do aluno
        const id = req.params.id;
        try{
            const alumn = await Alumn.findByPk(id);
            if(alumn){
                const turmas = await Group.findAll({ 
                    include: [
                        {
                            association: "alumns",
                            where: { alumn_id: id },
                            attributes: ['group_id', 'alumn_id']
                        },
                        {
                            association: "dates",
                            attributes: ['final_date'],
                            include: {
                                association: "quiz",
                                attributes: ['title']
                            }
                        }
                    ],
                    attributes: ['id', 'teacher_id', 'title', 'periode']
                })
                if(turmas){
                    return res.status(200).json(turmas);
                }
                return res.status(400).json({
                    Status: "Nenhuma turma encontrada"
                })
            }
            return res.status(400).json({
                Status: "Aluno não encontrado"
            })
        } catch(err){
            return res.status(400).json({
                Status: "Erro ao procurar turmas"
            })
        }
    },
    //ok
    async indexAllAdmin(req, res){
        try{
            const groups = await Group.findAll({
                include: [
                    {
                        association: 'teacher',
                        attributes: ['id', 'username']
                    }
                ],
                attributes: [
                    'id', 
                    'title', 
                    'periode',
                    'alumn_count'
                ]
            });
            return res.status(200).json({groups})
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async index(req, res){
        const { group_id } = req.params;
        try{
            const turma = await Group.findByPk(group_id, {
                include: [
                    {
                        association: 'alumns',
                        attributes: ['id'],
                        include: {
                            association:'alumn', 
                            attributes: ['id', 'username', 'register']
                        }
                    },
                    {
                        association: 'teacher',
                        attributes: ['id', 'username']
                    }
                ],
                attributes: ['id', 'teacher_id', 'title', 'periode']
            });
            if(turma){
                return res.status(200).json(turma)
            }
            return res.status(200).json({
                Status: "Turma não encontrada"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro ao procurar turma, " + err
            })
        }
    },
    //ok
    async indexAluno(req, res){
        const { id } = req.params;
        try{
            const aluno = await GroupAlumn.findOne({
                where: {alumn_id: id},
                attributes: ['id', 'alumn_id', 'group_id'],
                include:[
                    {
                        association: 'finishedActivities',
                        attributes: ['is_finished']
                    },
                    {
                        association: 'answers',
                        attributes: ['id'],
                        include: {
                            association: 'question',
                            attributes: ['quiz_id']
                        }
                    }
                ]
            });
            if(aluno){
                return res.status(200).json({
                    ...aluno.dataValues
                });
            }
                return res.status(200).json({
                    Status: "Aluno não encontrado"
                })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async indexAnswers(req, res){
        const { id } = req.params;
        try {
            const answers = await GroupAlumn.findByPk(id, {
                attributes: ['id', 'group_id', 'alumn_id'],
                include: {
                    association: "answers",
                    attributes: ['id', 'question_id', 'group_alumn_id'],
                    include: {
                        association: "question",
                        attributes: ['id', 'quiz_id']
                    }
                }
            });
            if(answers?.id != null){
                return res.status(200).json(answers);
            }
            return res.status(200).json({
                Status: "Aluno não encontrado"
            })
        } catch(err) {
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async lastAnswer(req, res){
        const { id, quiz_id } = req.params;
        try {
            const answer = await Answer.findAll({
                limit: 1,
                include: [
                    {
                        association: "alumn",
                        attributes: ['id'],
                        where: {
                            id: id
                        }
                    },
                    {
                        association: "question",
                        attributes: ['id', 'quiz_id', 'position'],
                        where: {
                            quiz_id: quiz_id
                        }
                    }
                ],
                order: [['created_at', 'DESC']]
            });
            return res.status(200).json(answer)
            /*if(answer?.alumn?.id != null) {
            }
            return res.status(200).json({
                Status: "Não encontrado"
            })*/
        } catch (err) {
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async getFinishedActivities(req, res){
        const { id } = req.params;
        try{
            const alumn = await GroupAlumn.findOne({
                where: { id: id },
                attributes: ['id'],
                include: {
                    association: "finishedActivities",
                    attributes: ['id', 'quiz_id', 'group_alumn_id', 'is_finished']
                }
            });
            if(!alumn){
                return res.status(200).json({
                    Status: "Não encontrado"
                })
            }
            return res.status(200).json(alumn)
        } catch(err) {
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //ok
    async indexAlunoResults(req, res){
        //id do aluno não da turma_aluno
        const { id } = req.params;
        try{
            const aluno = await GroupAlumn.findOne({ where: {alumn_id: id} });
            if(aluno){
                const resultados = await Quiz.findAll({
                    attributes: [
                        'title', 'question_count',
                        [
                            sequelize.fn('SUM', 
                                sequelize.where(
                                    sequelize.col('questions.answers.question_answer'),
                                    sequelize.col('questions.correct_answer'))
                            ), 
                            'hit'
                        ]
                    ],
                    include: {
                        association:
                            'questions',
                            attributes: [],
                            include: {
                                association: 'answers',
                                attributes: [],
                                where: { group_alumn_id: aluno.id }
                            }
                        
                    },
                    group: ['id'],
                    order: ['id']
                })
                return res.status(200).json(resultados);
            }
            return res.status(200).json({
                Status: "Aluno não encontrado"
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
            const turma = await Group.findByPk(id);
            if(turma){
                turma.destroy();
                return res.status(200).json({
                    Status: "Turma deletada"
                })
            }
            return res.status(200).json({
                Status: "Turma não encontrada"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro ao deletar turma"
            })
        }
    },
    //ok
    async update(req, res){
        const { id } = req.params;
        try{
            const turma = await Group.findByPk(id);
            if(turma){
                turma.update(req.body);
                return res.status(200).json({
                    Status: "Dados do grupo alterados"
                })
            }
            return res.status(200).json({
                Status: "Turma não encontrada"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro ao editar turma"
            })
        }
    },
    //ok
    async deleteAluno(req, res){
        const { id } = req.params;
        try{
            const aluno = await GroupAlumn.findByPk(id);
            if(aluno){
                const group = await Group.findByPk(aluno.group_id);
                await group.update({ alumn_count: group.alumn_count - 1 });
                await aluno.destroy();
                return res.status(200).json({
                    Status: "Aluno excluido"
                })
            }
            return res.status(200).json({
                Status: "Aluno não encontrado"
            })
        } catch(err) {
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
}