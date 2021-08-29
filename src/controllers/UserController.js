const User = require("../models/User");
const bcrypt = require("bcrypt");
const Professor = require("../models/Professor");
const Aluno = require("../models/Aluno");
const TurmaAluno = require("../models/TurmaAluno");
const Notification = require("../models/Notification");

module.exports = {
    //pegar dados
    async index(req, res){
        const id = req.query.id;
        const email = req.query.email;
        try{
            const user = id 
            ? await User.findByPk(id)
            : await User.findOne({email});
            const { password, updated_at, ...other } = user.dataValues;
            if(user.is_professor){
                const professor = await Professor.findByPk(id);
                const { username, profile_picture, ...otherP } = professor.dataValues;
                return res.status(200).json(Object.assign({}, other, {username, profile_picture}));
            }
            const aluno = await Aluno.findByPk(id);
            const { turma_id, register_complete, matricula, username, profile_picture, birthday, gender, periode, ...otherA } = aluno.dataValues;
            return res.status(200).json(Object.assign({}, other, {turma_id, register_complete, matricula, username, profile_picture, birthday, gender, periode}));
        } catch(err){
            return res.status(400).json(err)
        }
    },
    //atualizar dados
    async updateProfessor(req, res) {
        const { newUserData, newUser} = req.body;

        //parte de user
        const user = await User.findByPk(req.params.id);
        if(newUserData){
            try{
                const salt = await bcrypt.genSalt(10);
                newUserData.password = await bcrypt.hash(newUserData.password, salt);
            } catch(err){
                return res.status(400).json(err)
            }
            const resultUser = await user.update(newUserData);
            if(!resultUser){
                return res.status(400).json({
                    Error: ["Não foi possível alterar os dados!"]
                })
            }
        }
        //final da parte de user
        //parte professor
        const professor = await Professor.findByPk(req.params.id);
        if(professor){
            const resultProfessor = professor.update(newUser);
            return res.status(200).json("Usuário alterado!");
        }
        return res.status(200).json("Usuário não alterado");
    },
    //atualizar dados
    async updateAluno(req, res) {

        const { newUserData, newUser} = req.body;

        //parte de user
        const user = await User.findByPk(req.params.id);
        if(newUserData){
            try{
                const salt = await bcrypt.genSalt(10);
                newUserData.password = await bcrypt.hash(newUserData.password, salt);
            } catch(err){
                return res.status(400).json(err)
            }
            const resultUser = await user.update(newUserData);
            if(!resultUser){
                return res.status(400).json({
                    Error: ["Não foi possível alterar os dados!"]
                })
            }
        }
        //final da parte de user
        //parte aluno
        const aluno = await Aluno.findByPk(req.params.id);
        if(aluno){
            const resultAluno = aluno.update(newUser);
            return res.status(200).json("Usuário alterado!");
        }
        return res.status(200).json("Usuário não alterado");
    },
    //deletar usuário
    async delete(req, res){
        const user = await User.findByPk(req.params.id);
        if(!user){
            return res.status(400).json({
                Error: ["Usuário não encontrado!"]
            })
        }
        await user.destroy();

        return res.status(200).json({
            Sucess: ["Usuário removido!"]
        })
    },
    async indexResult(req, res){
        const { id } = req.params;
        try{
            const aluno = await TurmaAluno.findOne({
                where: { aluno_id: id},
                attributes: ["id"],
                include: { 
                    association: 'notas',
                    attributes: ['id', 'resposta_questao'],
                        include: { 
                            association: 'questao', 
                            attributes: ['id', 'resposta_correta', 'quizz_id']
                        }
                }
            });
            if(aluno){
                return res.status(200).json(aluno);
            }
            return res.status(200).json({
                Status: ["Aluno não encontrado"]
            })
        } catch(err){
            return res.status(200).json({
                Status: ["Erro"]
            })
        }
    },
    async updateUserPass(req, res){
        const { password, token } = req.body;
        const { id } = req.params;
        try{
            const user = await User.findByPk(id);
            if(user){
                const newUser = user;
                const salt = await bcrypt.genSalt(10);
                newUser.password = await bcrypt.hash(password, salt);
                const result = await user.save(newUser);
                if(result){
                    const notification = await Notification.findOne({where: {title: token}});
                    if(notification){
                        await notification.destroy();
                        return res.status(200).json({
                            Status: "Senha alterada"
                        })
                    }
                }
                return res.status(200).json({
                    Status: "Não foi possível alterar a senha"
                })
            }
            return res.status(200).json({
                Status: "Usuário não encontrado"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno" + err
            })
        }
    }
}