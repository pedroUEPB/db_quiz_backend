const User = require("../models/User");
//const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
const Admin = require("../models/Admin");
const Professor = require("../models/Professor");
const Aluno = require("../models/Aluno");
const TurmaAluno = require("../models/TurmaAluno");
const Notification = require("../models/Notification");

const jwt = require("jsonwebtoken");
const generateAccessToken = (user) => {
    return jwt.sign({ 
        id: user.id,
        is_admin: user.is_admin,
        is_professor: user.is_professor,
        is_aluno: user.is_aluno,
        register_finished: user.register_finished,
        form_clicked: user.form_clicked,
    }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
};

module.exports = {
    //pegar dados
    async index(req, res){
        const id = req.params.id;
        const email = req.query.email;
        try{
            const user = id 
            ? await User.findByPk(id)
            : await User.findOne({email});
            const { password, updated_at, ...other } = user.dataValues;
            if(user.is_professor){
                const professor = await Professor.findByPk(id);
                const { register_finished, matricula, username, profile_picture, birthday, gender, periode, city, state, institute, ...otherP } = professor;
            return res.status(200).json(Object.assign({}, other, {register_finished, matricula, username, profile_picture, birthday, gender, periode, city, state, institute}));
            }else if(user.is_aluno){
                const aluno = await Aluno.findByPk(id, {
                    include: {
                        association: 'turmas'
                    }
                });
                const { register_finished, matricula, username, profile_picture, birthday, gender, periode, city, state, institute, turmas, ...otherA } = aluno;
                return res.status(200).json(Object.assign({}, other, {register_finished, matricula, username, profile_picture, birthday, gender, periode, city, state, institute, turmas}));
            }
            const  admin = await Admin.findByPk(id);
            const { username, profile_picture } = admin;
            return res.status(200).json(Object.assign({}, other, {username, profile_picture}));
        } catch(err){
            return res.status(200).json({
                Status: "erro interno, " + err
            })
        }
    },
    //get User Photo
    async indexPhoto(req, res){
        const { id } = req.body.id;
        try{
            const user = await User.findOne({
                where: { id: id},
                include: [
                    {
                        association: "admin",
                        attributes: ['id', 'profile_picture']
                    },
                    {
                        association: "professor",
                        attributes: ['id', 'profile_picture']
                    },
                    {
                        association: "aluno",
                        attributes: ['id', 'profile_picture']
                    }
                ]
            });
            if(user){
                if(user.admin.id){
                    return res.status(200).json(
                        {profile_picture: user.admin.profile_picture}
                    )
                } else if(user.professor.id){
                    return res.status(200).json(
                        {profile_picture: user.professor.profile_picture}
                    )
                }
                return res.status(200).json(
                    {profile_picture: user.aluno.profile_picture}
                )
            }
            return res.status(200).json({
                Status: "Usuário não encontrado!"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    //verificar se existe aluno baseado no email e se já tem uma turma
    async userExist(req, res){
        const email = req.params.email;
        console.log(email);
        try{
            const user = await User.findOne({
                where: {email: email},
                include:{
                    association: 'aluno',
                    include: {
                        association: 'turmas'
                    }
                }
            });
            if(user){
                if(user.is_aluno){
                    if(user.aluno.turmas.length > 0){
                        return res.status(200).json({
                            Status: "O aluno já esta alocado à uma turma"
                        })
                    }
                    const id = user.id;
                    return res.status(200).json({
                        id
                    })
                }
                return res.status(200).json({
                    Status: "Email informado não pertence a um aluno"
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
    //pegar todos os usuários
    async indexAll(req, res){
        const type = req.query.type;
        try{
            if(type){
                const users = await User.findAll({
                    where: { is_professor: true},
                    attributes: ['id', 'email', 'is_professor', 'is_admin', 'is_aluno', 'is_google_login'],
                    include:{
                        association: type
                    }
                })
                return res.status(200).json({
                    users
                })
            }
            const users = await User.findAll({
                attributes: ['id', 'email', 'is_professor', 'is_admin', 'is_aluno','is_google_login'],
                include: [
                    {
                        association: 'aluno'
                    },
                    {
                        association: 'professor'
                    },
                    {
                        association: 'admin'
                    }
                ]
            });
            return res.status(200).json({
                users
            })
        } catch(err){
            return res.status(200).json({
                Status: "erro interno, " + err
            })
        }
    },
    //atualizar dados
    async updateProfessor(req, res) {
        const { newUserData, newUser} = req.body;

        //parte de user
        const user = await User.findByPk(req.params.id);
        if(newUserData.password){
            try{
                const salt = await bcryptjs.genSalt(10);
                newUserData.password = await bcryptjs.hash(newUserData.password, salt);
            } catch(err){
                return res.status(200).json({
                    Status: "Erro interno, " + err
                })
            }
            const resultUser = await user.update(newUserData);
            if(!resultUser){
                return res.status(200).json({
                    Status: "Não foi possível alterar os dados!"
                })
            }
        }
        //final da parte de user
        //parte professor
        const professor = await Professor.findByPk(req.params.id);
        if(professor){
            await professor.update(newUser);
            const  accessToken = generateAccessToken({
                id: newUser.id,
                is_professor: newUserData.is_professor,
                is_admin: newUserData.is_admin,
                is_aluno: newUserData.is_aluno,
                register_finished: newUser.register_finished,
                profile_picture: newUser.profile_picture,
                form_clicked: newUserData.form_clicked
            });
            return res.status(200).json({
                Status: "Usuário alterado!",
                accessToken
            });
        }
        return res.status(200).json("Usuário não alterado");
    },
    //atualizar dados
    async updateAluno(req, res) {

        const { newUserData, newUser} = req.body;
        //parte de user
        const user = await User.findByPk(req.params.id);
        if(newUserData.password){
            try{
                const salt = await bcryptjs.genSalt(10);
                newUserData.password = await bcryptjs.hash(newUserData.password, salt);
            } catch(err){
                return res.status(200).json({
                    Status: "Erro ao alterar a senha, " + err
                });
            }
            const resultUser = await user.update(newUserData);
            if(!resultUser){
                return res.status(200).json({
                    Status: "Não foi possível alterar os dados!"
                })
            }
        }
        //final da parte de user
        //parte aluno
        const aluno = await Aluno.findByPk(req.params.id);
        if(aluno){
            await aluno.update(newUser);
            const aluno2 = await Aluno.findByPk(req.params.id);
            const  accessToken = generateAccessToken({
                id: newUser.id,
                is_admin: newUserData.is_admin,
                is_professor: newUserData.is_professor,
                is_aluno: newUserData.is_aluno,
                register_finished: newUser.register_finished,
                profile_picture: aluno2.profile_picture,
                form_clicked: newUserData.form_clicked,
            });
            return res.status(200).json({
                Status: "Usuário alterado!",
                accessToken
            });
        }
        return res.status(200).json({
            Status: "Usuário não alterado"
        });
    },
    //atualizar dados
    async updateAdmin(req, res) {
        
        const { newUserData, newUser} = req.body;
        //parte de user
        const user = await User.findByPk(req.params.id);
        if(newUserData.password){
            try{
                const salt = await bcryptjs.genSalt(10);
                newUserData.password = await bcryptjs.hash(newUserData.password, salt);
            } catch(err){
                return res.status(200).json({
                    Status: "Erro ao alterar a senha, " + err
                });
            }
            const resultUser = await user.update(newUserData);
            if(!resultUser){
                return res.status(200).json({
                    Status: "Não foi possível alterar os dados!"
                })
            }
        }
        //final da parte de user
        //parte admin
        const admin = await Admin.findByPk(req.params.id);
        if(admin){
            await admin.update(newUser);
            return res.status(200).json({
                Status: "Usuário alterado!"
            });
        }
        return res.status(200).json({
            Status: "Usuário não alterado"
        });
    },
    //deletar usuário
    async delete(req, res){
        const user = await User.findByPk(req.params.id);
        if(!user){
            return res.status(200).json({
                Status: "Usuário não encontrado!"
            })
        }
        await user.destroy();

        return res.status(200).json({
            Status: "Usuário removido!"
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
                const salt = await bcryptjs.genSalt(10);
                newUser.password = await bcryptjs.hash(password, salt);
                const result = await user.save(newUser);
                if(result){
                    await Notification.destroy({where: {message: "trocar senha", aluno_id: id}});
                    return res.status(200).json({
                        Status: "Senha alterada"
                    });
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