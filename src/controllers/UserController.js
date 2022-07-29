const User = require("../models/User");
//const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Alumn = require("../models/Alumn");
const GroupAlumn = require("../models/GroupAlumn");
const Notification = require("../models/Notification");

const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const generateAccessToken = (user) => {
    return jwt.sign({ 
        id: user.id,
        is_admin: user.is_admin,
        is_teacher: user.is_teacher,
        register_finished: user.register_finished,
        form_clicked: user.form_clicked,
    }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
};

module.exports = {
    //pegar dados
    //ok
    async index(req, res){
        const id = req.params.id;
        const email = req.query.email;
        try{
            const user = id 
            ? await User.findByPk(id)
            : await User.findOne({email});
            const { password, updated_at, ...other } = user.dataValues;
            if(user.is_teacher){
                const professor = await Teacher.findByPk(id);
                const { register_finished, register, username, birthday, gender, periode, city, state, institute, ...otherP } = professor;
            return res.status(200).json(Object.assign({}, other, {register_finished, register, username, birthday, gender, periode, city, state, institute}));
            } else if(!user.is_admin){
                const aluno = await Alumn.findByPk(id);
                const { register_finished, register, username, birthday, gender, periode, city, state, institute, groups, ...otherA } = aluno;
                return res.status(200).json(Object.assign({}, other, {register_finished, register, username, birthday, gender, periode, city, state, institute, groups}));
            }
            const  admin = await Admin.findByPk(id);
            const { username } = admin;
            return res.status(200).json(Object.assign({}, other, {username}));
        } catch(err){
            return res.status(200).json({
                Status: "erro interno, " + err
            })
        }
    },
    //ok
    async getAlumns(req, res) {
        try{
            const { email } = req.query;
            const alumns = await User.findAll({
                where: {
                    email: { [Op.substring]: email },
                    is_admin: false,
                    is_teacher: false
                },
                include: {
                    association: "alumn",
                    attributes: ['id'],
                    include: {
                        association: "groups",
                        attributes: ['group_id']
                    }
                },
                attributes: ['id', 'email']
            });
            if(alumns.length > 0) {
                return res.status(200).json({
                    alumns
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
    //ok
    async indexAll(req, res){
        const type = req.query.type;
        try{
            if(type){
                const users = await User.findAll({
                    where: { is_teacher: true},
                    attributes: ['id', 'email', 'is_teacher', 'is_admin', 'is_google_login'],
                    include:{
                        association: type
                    },
                })
                return res.status(200).json({
                    users
                })
            }
            const users = await User.findAll({
                attributes: ['id', 'email', 'is_teacher', 'is_admin','is_google_login'],
                include: [
                    {
                        association: 'alumn',
                        attributes: ['id', 'username']
                    },
                    {
                        association: 'teacher',
                        attributes: ['id', 'username']
                    },
                    {
                        association: 'admin',
                        attributes: ['id', 'username']
                    }
                ],
                order: ['id'],
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
    //ok
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
        const professor = await Teacher.findByPk(req.params.id);
        if(professor){
            await professor.update(newUser);
            const  accessToken = generateAccessToken({
                id: newUser.id,
                is_professor: newUserData.is_professor,
                is_admin: newUserData.is_admin,
                register_finished: newUser.register_finished,
                form_clicked: newUserData.form_clicked
            });
            return res.status(200).json({
                Status: "Usuário alterado",
                accessToken
            });
        }
        return res.status(200).json({
            Status: "Usuário não alterado"
        });
    },
    //ok
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
                    Status: "Não foi possível alterar os dados"
                })
            }
        }
        //final da parte de user
        //parte aluno
        const aluno = await Alumn.findByPk(req.params.id);
        if(aluno){
            await aluno.update(newUser);
            await Alumn.findByPk(req.params.id);
            const  accessToken = generateAccessToken({
                id: newUser.id,
                is_admin: newUserData.is_admin,
                is_teacher: newUserData.is_teacher,
                register_finished: newUser.register_finished,
                form_clicked: newUserData.form_clicked,
            });
            return res.status(200).json({
                Status: "Usuário alterado",
                accessToken
            });
        }
        return res.status(200).json({
            Status: "Usuário não alterado"
        });
    },
    //ok
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
                    Status: "Não foi possível alterar os dados"
                })
            }
        }
        //final da parte de user
        //parte admin
        const admin = await Admin.findByPk(req.params.id);
        if(admin){
            await admin.update(newUser);
            return res.status(200).json({
                Status: "Usuário alterado"
            });
        }
        return res.status(200).json({
            Status: "Usuário não alterado"
        });
    },
    //ok
    async delete(req, res){
        const user = await User.findByPk(req.params.id);
        if(!user){
            return res.status(200).json({
                Status: "Usuário não encontrado"
            })
        }
        await user.destroy();

        return res.status(200).json({
            Status: "Usuário removido"
        })
    },
    //ok
    async updateUserPass(req, res){
        const { password, token } = req.body;
        const { id } = req.params;
        try{
            const user = await User.findByPk(id);
            if(user){
                const notification = await Notification.findOne({ where: { user_id: id, title: token }});
                if(notification){
                    const newUser = user;
                    const salt = await bcryptjs.genSalt(10);
                    newUser.password = await bcryptjs.hash(password, salt);
                    const result = await user.save(newUser);
                    if(result){
                        await Notification.destroy({where: {message: "trocar senha", user_id: id}});
                        return res.status(200).json({
                            Status: "Senha alterada"
                        });
                    }
                    return res.status(200).json({
                        Status: "Não foi possível alterar a senha"
                    })
                }
                return res.status(200).json({
                    Status: "Informações não encontrada"
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