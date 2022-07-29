const GroupAlumn = require("../models/GroupAlumn");
const Invitation = require("../models/Invitation");

module.exports = {
    async index(req, res) {
        const { group_id, alumn_id } = req.params;
        const convite = await Invitation.findOne({ where: { group_id, alumn_id } });
        if(convite){
            if(convite.status === "Aberto") {
                return res.status(200).json({
                    Status: "Convite ativo"
                })
            }
            return res.status(200).json({
                Status: "Convite fechado"
            })
        }
        return res.status(200).json({
            Status: "Convite não encontrado"
        });
    },
    async change(req, res){
        const { status, group_id, alumn_id } = req.body;
        if(status === "Aceito"){
            const aluno = {
                turma_id,
                aluno_id
            }
            await GroupAlumn.create(aluno);
            const convite = await Invitation.findOne({where: {
                group_id, 
                alumn_id
            }});
            convite.status = status;
            await convite.destroy();
            return res.status(200).json({
                Status: "Convite aceito"
            })
        }
        const convite = await Invitation.findOne({where: {
            group_id, 
            alumn_id
        }});
        await convite.destroy();
        return res.status(200).json({
            Status: "Convite rejeitado"
        })
    }
}