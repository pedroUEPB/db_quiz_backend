const Turma = require("../models/Turma");
const Professor = require("../models/User");
const TurmaAluno = require("../models/TurmaAluno");
const QuizzTurma = require("../models/QuizzTurma");

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
    /*
    , {
                include: { association: 'alunos' }
            }
    */
    async index(req, res){
        const { turma_id } = req.params;
        try{
            const turma = await Turma.findByPk(turma_id, {
                include: {association: 'alunos', 
                    include: {association:'aluno', attributes: ['username', 'matricula']}
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
    async indexAluno(req, res){
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
                    Status: "Aluno encontrado",
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
    async delete(req, res){
        const { id } = req.params;
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
    }
}