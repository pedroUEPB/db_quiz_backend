const User = require("../models/User");
const Professor = require("../models/Professor");
const Aluno = require("../models/Aluno");
const Admin = require("../models/Admin");
//const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign({ 
        id: user.id,
        is_professor: user.is_professor,
        is_admin: user.is_admin,
        is_aluno: user.is_aluno,
        register_finished: user.register_finished, 
        profile_picture: user.profile_picture,
        form_clicked: user.form_clicked,
    }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
};

module.exports = {
    //REGISTERS
    //store
    async store(req, res){
        try{
            //console.log(req.body);
            const userVerif = await User.findOne({ where: { email: req.body.email } });
            if(!userVerif){
                let user;
                if(!req.body.is_google_login){
                    const salt = await bcryptjs.genSalt(10);
                    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
                    user = {
                        email: req.body.email,
                        password: hashedPassword,
                        is_admin: req.body.is_admin,
                        is_professor: req.body.is_professor,
                        is_aluno: req.body.is_aluno,
                        is_google_login: req.body.is_google_login,
                    }
                } else {
                    user = {
                        email: req.body.email,
                        is_professor: req.body.is_professor,
                        is_google_login: req.body.is_google_login,
                        is_admin: req.body.is_admin
                    }
                }
                if(req.body.is_professor){
                    //user.professor.username = req.body.professor.username;
                    const usr = await User.create({
                            ...user, 
                            professor:{ 
                                username: req.body.professor.username
                            }
                        }, {
                            include: {
                                association: 'professor'
                            }
                    });
                    if(usr){
                        return res.status(200).json({
                            Status: "Usuário cadastrado!"
                        })
                    }
                } else if(req.body.is_aluno){
                    const usr = await User.create({
                        ...user, 
                        aluno:{ 
                            username: req.body.aluno.username
                        }
                    }, {
                        include: {
                            association: 'aluno'
                        }
                });
                    if(usr){
                        return res.status(200).json({
                            Status: "Usuário cadastrado!"
                        })
                    }
                }
                const usr = await User.create({
                    ...user, 
                    admin:{ 
                        username: req.body.admin.username
                    }
                }, {
                    include: {
                        association: 'admin'
                    }
            });
                if(usr){
                    return res.status(200).json({
                        Status: "Usuário cadastrado!"
                    })
                }
            }
            return res.status(200).json({
                Status: "Email já cadastrado"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async storeAdmin(req, res){
        try{
            //console.log(req.body);
            const userVerif = await User.findOne({ where: { email: req.body.email } });
            if(!userVerif){
                let user;
                if(!req.body.is_google_login){
                    const salt = await bcryptjs.genSalt(10);
                    const hashedPassword = await bcryptjs.hash(req.body.password, salt);
                    user = {
                        email: req.body.email,
                        password: hashedPassword,
                        is_admin: req.body.is_admin,
                        is_professor: req.body.is_professor,
                        is_aluno: req.body.is_aluno,
                        is_google_login: req.body.is_google_login,
                    }
                } else {
                    user = {
                        email: req.body.email,
                        is_professor: req.body.is_professor,
                        is_google_login: req.body.is_google_login,
                        is_admin: req.body.is_admin
                    }
                }
                if(req.body.is_professor){
                    //user.professor.username = req.body.professor.username;
                    const usr = await User.create({
                            ...user, 
                            professor:{ 
                                username: req.body.professor.username
                            }
                        }, {
                            include: {
                                association: 'professor'
                            }
                    });
                    if(usr){
                        return res.status(200).json({
                            Status: "Usuário cadastrado!"
                        })
                    }
                } else if(req.body.is_aluno){
                    const usr = await User.create({
                        ...user, 
                        aluno:{ 
                            username: req.body.aluno.username
                        }
                    }, {
                        include: {
                            association: 'aluno'
                        }
                });
                    if(usr){
                        return res.status(200).json({
                            Status: "Usuário cadastrado!"
                        })
                    }
                }
                const usr = await User.create({
                    ...user, 
                    admin:{ 
                        username: req.body.admin.username
                    }
                    }, {
                    include: {
                        association: 'admin'
                    }
                });
            }
            return res.status(200).json({
                Status: "Email já cadastrado"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async login(req, res) {
        try{
            const user = await User.findOne({ 
                where: { email: req.body.email },
            });
            if(!user){
                return res.status(200).json({
                    Status :"Usuário não encontrado!"
                });
            }
            if(req.body.loginType === 0){
                if(!user.is_google_login){
                    const validPass = await bcryptjs.compare(req.body.password, user.password)
                    if(!validPass){
                        return res.status(200).json({
                            Status: "Senha incorreta! " + req.body.password + "-" + user.password
                        });
                    }
                } else {
                    return res.status(200).json({
                        Status: "Email registrado com o google!"
                    })
                }
            }
            if(user.is_admin){
                const admin = await Admin.findByPk(user.id);
                const  accessToken = generateAccessToken({
                    id: user.id,
                    is_professor: user.is_professor,
                    is_aluno: user.is_aluno,
                    email: user.email,
                    is_admin: user.is_admin,
                    profile_picture: admin.profile_picture
                });
                return res.status(200).json({
                    username: admin.username,
                    profile_picture: admin.profile_picture,
                    //is_admin: user.is_admin,
                    accessToken
                })
            }
            if(user.is_professor){
                const professor = await Professor.findByPk(user.id);
                const  accessToken = generateAccessToken({
                    id: user.id,
                    is_professor: user.is_professor,
                    is_aluno: user.is_aluno,
                    email: user.email,
                    register_finished: professor.register_finished,
                    is_admin: user.is_admin,
                    form_clicked: user.form_clicked,
                    profile_picture: professor.profile_picture
                });
                return res.status(200).json({
                    username: professor.username,
                    profile_picture: professor.profile_picture,
                    //is_admin: user.is_admin,
                    //is_professor: user.is_professor,
                    //register_finished: professor.register_finished,
                    accessToken
                })
            }
            //precis lterar pra pegar dados de turma-aluno, turma e quizz-turma
            const aluno = await Aluno.findByPk(user.id);
            const  accessToken = generateAccessToken({
                id: user.id,
                is_professor: user.is_professor,
                email: user.email,
                is_aluno: user.is_aluno,
                register_finished: aluno.register_finished,
                is_admin: user.is_admin,
                profile_picture: aluno.profile_picture,
                form_clicked: user.form_clicked,
            });
            return res.status(200).json({
                username: aluno.username,
                profile_picture: aluno.profile_picture,
                //is_admin: user.is_admin,
                //is_professor: user.is_professor,
                //register_finished: aluno.register_finished,
                accessToken
            })

            /*
            const { email, is_professor, is_google_login, ...otherUser } = user.dataValues;
            const { created_at, updated_at, ...other } = aluno.dataValues;
            return res.status(200).json(Object.assign({}, other, {email, is_professor, is_google_login}));
            */
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            });
        }
    },
    async verifPass(req, res){
        const { id } = req.params;
        const { password } = req.body;
        try{
            const user = await User.findByPk(id);
            if(user){
                const validPass = await bcryptjs.compare(password, user.password);
                if(!validPass){
                    return res.status(200).json({
                        Status: "Senha incorreta!"
                    });
                }
                return res.status(200).json({
                    Status: "Ok"
                })
            }
            return res.status(200).json({
                Status: "Usuário não existe"
            })
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    }
}