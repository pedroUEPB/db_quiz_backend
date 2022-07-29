const Alumn = require("../models/Alumn");
const Notification = require("../models/Notification");
const GroupAlumn = require("../models/GroupAlumn");
const Group = require("../models/Group");

module.exports = {
    async indexNotificationsAluno(req, res){
        const { id } = req.params;
        try{
            const aluno = await Alumn.findByPk(id);
            if(aluno){
                const notifications = await Notification.findAll({ where: { user_id: id }})
                if(notifications.length > 0){
                    return res.status(200).json(notifications);
                }
                return res.status(200).json({
                    Status: "Sem notificações"
                });
            } else {
                return res.status(200).json({
                    Status: "Aluno não encontrado"
                })
            }
        } catch(err){
            return res.status(200).json({
                Status: [err]
            })
        }
    },
    async accept(req, res){
        const { id } = req.params;
        try{
            const convite = await Notification.findByPk(id);
            if(convite){
                const aluno = {
                    group_id: convite.group_id,
                    alumn_id: convite.user_id,
                }
                const group = await Group.findByPk(convite.group_id);
                if(group){
                    await GroupAlumn.create(aluno);
                    await Notification.destroy({ 
                        where: {
                            group_id: convite.group_id,
                            user_id: convite.user_id
                        }
                    });
                    group.alumn_count = group.alumn_count + 1;
                    await group.save();
                    return res.status(200).json({
                        Status: "Convite aceito"
                    });
                }
                return res.status(200).json({
                    Status: "Grupo não existe"
                })
            } else {
                return res.status(200).json({
                    Status: "Convite não encontrado"
                })
            }
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async reject(req, res){
        const { id } = req.params;
        try{
            const convite = await Notification.findByPk(id);
            if(convite){
                await Notification.destroy({ 
                    where: {
                        group_id: convite.group_id,
                        user_id: convite.user_id
                    }
                })
                //await Notification.destroy({ where: { alumn_id: convite.alumn_id }});
                return res.status(200).json({
                    Status: "Convite rejeitado"
                });
            } else {
                return res.status(200).json({
                    Status: "Convite não encontrado"
                })
            }
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
}