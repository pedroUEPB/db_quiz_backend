const TurmaAluno = require("../models/TurmaAluno");
const Convite = require("../models/Convite");

module.exports = {
    async index(req, res) {
        const { turma_id, aluno_id } = req.params;
        const convite = await Convite.findOne({ where: { turma_id, aluno_id } });
        if(convite){
            //console.log(convite);
            if(convite.status === "Aberto") {
                return res.status(200).json({
                    Error: ["Convite ativo!"]
                })
            }
            return res.status(200).json({
                Error: ["Convite fechado!"]
            })
        }
        return res.status(200).json({
            Error: ["Convite não encontrado!"]
        });
    },
    async change(req, res){
        const { status, turma_id, aluno_id } = req.body;
        if(status === "Aceito"){
            const aluno = {
                turma_id,
                aluno_id
            }
            const resp = await TurmaAluno.create(aluno);
            const convite = await Convite.findOne({where: {
                turma_id, 
                aluno_id
            }});
            convite.status = status;
            await convite.destroy();
            return res.status(200).json({
                Error: ["Convite aceito!"]
            })
        }
        const convite = await Convite.findOne({where: {
            turma_id, 
            aluno_id
        }});
        await convite.destroy();
        return res.status(200).json({
            Error: ["Convite rejeitado!"]
        })
    }
}