const Turma = require("../models/Turma");
const Professor = require("../models/User");
const TurmaAluno = require("../models/TurmaAluno");
const QuizzTurma = require("../models/QuizzTurma");
const Resposta = require("../models/Resposta");
const TurmaAlunoQuiz = require("../models/TurmaAlunoQuiz");
const Quizz = require("../models/Quizz");
//const { sequelize } = require("../models/Turma");
const sequelize = require("sequelize");

module.exports = {
    //create
    async store(req, res){
        const { professor_id } = req.body;
        try{
            const professor = await Professor.findByPk(professor_id);
            if(professor){
                if(professor.is_professor){
                    const turma = await Turma.create(req.body);
                    if(!turma){
                        return res.status(400).json({
                            Err: ["não foi possível salvar"]
                        })
                    }
                    return res.status(200).json(turma);
                }
                return res.status(400).json({
                    Err: ["É necessário ser professor!"]
                })
            }
            return res.status(400).json({
                Err: ["Usuário não cadastrado"]
            })
        } catch(err){
            return res.status(400).json(err)
        }
    },
    async indexAll(req, res){
        const id = req.params.id;
        try{
            const professor = await Professor.findByPk(id);
            if(professor){
                const turmas = await Turma.findAll({ 
                    where: {professor_id: professor.id} 
                })
                if(turmas){
                    return res.status(200).json(turmas);
                }
                return res.status(400).json({
                    Err: ["Nenhuma turma encontrada!"]
                })
            }
            return res.status(400).json({
                Err: ["Professor não encontrado!"]
            })
        } catch(err){
            return res.status(400).json({
                Err: ["Erro ao procurar turmas"]
            })
        }
    },
    
    async indexAllAdmin(req, res){
        try{
            const groups = await Turma.findAll({
                include: [
                    {
                        association: 'professor'
                    },
                    {
                        association: 'alunos',
                        include: {
                            association: 'aluno'
                        }
                    }
                ]
            });
            return res.status(200).json({groups})
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async index(req, res){
        const { turma_id } = req.params;
        try{
            const turma = await Turma.findByPk(turma_id, {
                include: [
                    {
                        association: 'alunos',
                        attributes: ['id'],
                        include: {
                            association:'aluno', 
                            attributes: ['id', 'username', 'matricula', 'profile_picture']
                        }
                    },
                    {
                        association: 'professor'
                    }
            ]
            });
            if(turma){
                return res.status(200).json(turma)
            }
            return res.status(200).json({
                Status: "Turma não encontrada!"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro ao procurar turma"
            })
        }
    },
    async quizzTurma(req, res){
        const { turma_id } = req.params;
        try{
            const turma = await Turma.findByPk(turma_id, {
                include: {association: 'entrega', 
                    include: {association: 'quizz'}
                }
            });
            if(turma){
                return res.status(200).json(turma)
            }
            return res.status(400).json({
                Err: ["Turma não encontrada!"]
            })
        } catch(err){
            return res.status(200).json({
                Err: ["Erro ao procurar turma"]
            })
        }
    },
    async indexAlunoWithNotas(req, res){
        const { id } = req.params;
        try{
            const aluno = await TurmaAluno.findOne({
                where: {aluno_id: id},
                include: {
                    association: 'notas'
                }
            });
            if(aluno){
                return res.status(200).json({
                    aluno
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
    async indexAluno(req, res){
        const { id } = req.params;
        try{
            const aluno = await TurmaAluno.findOne({
                where: {aluno_id: id},
                include:[
                    {
                        association: 'finishedActivities'
                    },
                    {
                        association: 'notas'
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
    
    async indexAlunoResults(req, res){
        //id do aluno não da turma_aluno
        const { id } = req.params;
        try{
            const aluno = await TurmaAluno.findOne({ where: {aluno_id: id} });
            if(aluno){
                const resultados = await Quizz.findAll({
                    attributes: [
                        'title', 'question_count',
                        [
                            sequelize.fn('SUM', 
                                sequelize.where(
                                    sequelize.col('questoes.respostas.resposta_questao'),
                                    sequelize.col('questoes.resposta_correta'))
                            ), 
                            'acertos'
                        ]
                    ],
                    include: {
                        association:
                            'questoes',
                            attributes: [],
                            include: {
                                association: 'respostas',
                                attributes: [],
                                where: { turma_aluno_id: aluno.id }
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
            /*const aluno = await TurmaAluno.findOne({
                where: {aluno_id: id},
                include:[
                    {
                        association: 'finishedActivities'
                    },
                    {
                        association: 'notas',
                        include:{
                            association: 'questao'
                        }
                    }
                ]
            });
            if(aluno){
                const activities = await Quizz.findAll({
                    include: {
                        association: 'questoes'
                    }
                });
                if(activities.length > 0){
                    let result = [];
                    let valor = activities.length + 1;
                    if(aluno.notas.length > 0){
                        for(let i=0;i<valor;i++){
                            result.push({score: 0, percent: 0});

                        }
                        let count = 0;
                        let maxQuestionCount = 0;
                        for(let i=0;i<activities.length;i++){
                            maxQuestionCount = maxQuestionCount + activities[i].question_count;
                            for(let k=0;k<activities[i].questoes.length;k++){
                                for(let j=0;j<aluno.notas.length;j++){
                                    if(activities[i].questoes[k].id === aluno.notas[j].questao.id){
                                        if(activities[i].questoes[k].resposta_correta === aluno.notas[j].resposta_questao){
                                            //atividade
                                            result[count].score = result[count].score + 1;
                                            result[count].percent = parseInt((result[count].score/activities[i].question_count)*100);
                                            //geral
                                            result[valor - 1].score = result[valor - 1].score + 1;
                                            result[valor - 1].percent = parseInt((result[valor - 1].score/maxQuestionCount)*100);
                                        }
                                    }
                                }
                            }
                            count++;
                        }
                        return res.status(200).json(Object.assign({}, {resultados: result, atividades: activities, maxQuestion: maxQuestionCount}));
                    }
                    return res.status(200).json(Object.assign({}, {resultados: result, atividades: activities}));
                }
                return res.status(200).json({
                    ...aluno.dataValues
                });
            }
            return res.status(200).json({
                Status: "Aluno não encontrado"
            })*/
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //RESPOSTAS
    async indexRespostas(req, res){
        const { id, quiz_id } = req.params;
        console.log(quiz_id);
        try{
            const notas = await Resposta.findAll({
                include: [
                    {
                        association: 'aluno',
                        attributes: ['id'],
                        where: {turma_id: id}
                    },
                    {
                        association: 'questao',
                        attributes: ['resposta_correta'],
                        where: {quizz_id: quiz_id}
                    }
                ],
                attributes: ['id', 'resposta_questao']
            });
            if(notas){
                return res.status(200).json(notas);
            }
            return res.status(200).json({
                Status: "Nenhum dado encontrado"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async delete(req, res){
        const { id } = req.params;
        console.log("aqui")
        try{
            const turma = await Turma.findByPk(id);
            if(turma){
                turma.destroy();
                return res.status(200).json({
                    Status: ["Turma deletada"]
                })
            }
            return res.status(200).json({
                Status: ["Turma não encontrada"]
            })
        } catch(err){
            return res.status(200).json({
                Status: ["Erro ao deletar turma"]
            })
        }
    },
    async update(req, res){
        const { id } = req.params;
        try{
            const turma = await Turma.findByPk(id);
            if(turma){
                turma.update(req.body);
                return res.status(200).json({
                    Status: ["Dados do grupo alterados"]
                })
            }
            return res.status(200).json({
                Status: ["Turma não encontrada"]
            })
        } catch(err){
            return res.status(200).json({
                Status: ["Erro ao editar turma"]
            })
        }
    },
    async dataEntrega(req, res){
        const { turma_id, quizz_id } = req.params;
        try{
            const quizzTurma = await QuizzTurma.findOne({ 
                where: { 
                    turma_id: turma_id, quizz_id: quizz_id 
                }
            });
            if(quizzTurma){
                return res.status(200).json({
                    Status: "Encontrou",
                    quizzTurma
                })
            }
            return res.status(200).json({
                Status: ["Não encontrado"]
            })
        } catch(err){
            return res.status(200).json({
                Status: ["Erro ao procurar data"]
            })
        }
    },
    async deleteAluno(req, res){
        const { id } = req.params;
        console.log("chegou aqui");
        try{
            const aluno = await TurmaAluno.findByPk(id);
            if(aluno){
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
    async updateTurmaAluno(req, res){
        const { id } = req.params;
        try{
            const turma_aluno = await TurmaAluno.findByPk(id);
            if(turma_aluno){
                const result = await turma_aluno.update(req.body);
                if(result){
                    return res.status(200).json({
                        Status: "Salvo"
                    })
                }
                return res.status(200).json({
                    Status: "Erro ao salvar"
                })
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
    async updateOrCreateFinishAct(req, res){
        const { id } = req.params;
        try{
            const turma_aluno = await TurmaAluno.findByPk(id);
            if(turma_aluno){
                const { quiz_id, turma_aluno_id, is_finished } = req.body;
                const [fa, created] = await TurmaAlunoQuiz.findOrCreate({
                    where: { quiz_id: quiz_id, turma_aluno_id: id},
                    defaults: {
                        quiz_id: quiz_id,
                        turma_aluno_id: turma_aluno_id,
                        is_finished: is_finished,
                    }
                })
                if(created){
                    return res.status(200).json({
                        Status: "Atividade finalizada(creation)"
                    })
                }
                await fa.save({is_finished: is_finished});
                return res.status(200).json({
                    Status: "Atividade finalizada(updating)"
                })
            }
            return res.status(200).json({
                Status: "Aluno não encontrado na turma"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    }
}