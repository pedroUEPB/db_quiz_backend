const Aluno = require("../models/Aluno");
const Notification = require("../models/Notification");
const TurmaAluno = require("../models/TurmaAluno");
const User = require("../models/User");

module.exports = {
    async indexNotificationsAluno(req, res){
        const { id } = req.params;
        try{
            const aluno = await Aluno.findByPk(id);
            if(aluno){
                const notifications = await Notification.findAll({ where: { aluno_id: id }})
                if(notifications.length > 0){
                    return res.status(200).json(notifications);
                }
                return res.status(200).json(null);
            } else {
                return res.status(200).json({
                    Status: ["Aluno não encontrado"]
                })
            }
        } catch(err){
            return res.status(200).json({
                Status: [err]
            })
        }
    },
    async index(req, res){
        const { id } = req.params;
        try{
            const notification = await Notification.findByPk(id);
            if(notification){
                return res.status(200).json(notification);
            }
            return res.status(200).json(null);
        } catch(err){
            return res.status(200).json({
                Status: [err]
            })
        }
    },
    async update(req, res){
        const { id } = req.params;
        const { status } = req.body;
        try{
            const convite = await Notification.findByPk(id);
            if(convite){
                if(status === "Aceito"){
                    const aluno = {
                        turma_id: convite.turma_id,
                        aluno_id: convite.aluno_id,
                    }
                    await TurmaAluno.create(aluno);
                    await convite.destroy();
                    return res.status(200).json({
                        Status: "Convite aceito!"
                    })
                } else {
                    await convite.destroy();
                    return res.status(200).json({
                        Status: "Convite recusado!"
                    })
                }
            } else {
                return res.status(200).json({
                    Status: "erro"
                })
            }
        } catch(err){
            return res.status(200).json({
                Status: err
            })
        }
    },
    async indexOne(req, res){
        const { id, token } = req.params;
        //console.log(req.body);
        try{
            const notification = await Notification.findOne({ where: {aluno_id: id, title: token}});
            if(notification){
                return res.status(200).json({
                    Status: "Encontrado"
                })
            }
             return res.status(200).json({
                 Status: "Não encontrado"
             })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno"
            })
        }
    }
}