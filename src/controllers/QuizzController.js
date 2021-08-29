const Quizz = require("../models/Quizz");
const Questao = require("../models/Questao");
const Resposta = require("../models/Resposta");
const QuizzTurma = require("../models/QuizzTurma");

module.exports = {
    //CREATE QUIZZ
    async store(req, res) {
        try{
            const quizz = await Quizz.create(req.body);
            if(!quizz){
                return res.status(400).json({
                    Err: ["não foi possível salvar"]
                })
            }
            console.log(quizz);
            return res.status(200).json(quizz);
        } catch(err){
            return res.status(400).json(err)
        }
    },
    //CREATE QUESTION
    async storeQuestion(req, res) {
        const { quizz_id } = req.body;
        try{
            const quizz = await Quizz.findByPk(quizz_id);
            if(quizz){
               const questoes = await Questao.create(req.body);
               if(questoes){
                   //não testado ainda
                   quizz.question_count = quizz.question_count + 1;
                   await quizz.save();
                   return res.status(200).json({
                       Status: ["Salvo"]
                   })
               }
               return res.status(200).json({
                   Status: ["Não foi possivel salvar"]
               })
            }
            return res.status(200).json({
                Status: ["Quizz não encontrado"]
            });
        } catch(err){
            return res.status(400).json(err)
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
            const quizz = await Quizz.findByPk(id, {
                include: { 
                    association: 'questoes',
                },
                order: [["questoes", "created_at", "ASC"]]
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
            return res.status(400).json({
                Error: ["Erro ao procurar o quizz!"]
            })
        }
    },
    async update(req, res){
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
    }
}