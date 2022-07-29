const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Alumn = require("../models/Alumn");
const Admin = require("../models/Admin");
//const bcrypt = require("bcrypt");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign({ 
        id: user.id,
        is_teacher: user.is_teacher,
        is_admin: user.is_admin,
        register_finished: user.register_finished,
        form_clicked: user.form_clicked,
    }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
};

module.exports = {
    //REGISTERS
    //store
    //ok
    async store(req, res){
        try{
            const userVerif = await User.findOne({ where: { email: req.body.email } });
            if(!userVerif){
                let user;
                if(!req.body.is_google_login){
                    const salt = await bcryptjs.genSalt(10);
                    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
                    user = {
                        email: req.body.email,
                        password: hashedPassword,
                        is_google_login: req.body.is_google_login,
                        is_admin: req.body.is_admin,
                        is_teacher: req.body.is_teacher,
                    }
                } else {
                    user = {
                        email: req.body.email,
                        is_google_login: req.body.is_google_login,
                        is_admin: req.body.is_admin,
                        is_teacher: req.body.is_teacher,
                    }
                }
                if(req.body.is_teacher){
                    //user.teacher.username = req.body.teacher.username;
                    const usr = await User.create({
                            ...user, 
                            teacher:{ 
                                username: req.body.teacher.username
                            }
                        }, {
                            include: {
                                association: 'teacher'
                            }
                    });
                    if(usr){
                        return res.status(200).json({
                            Status: "Usuário cadastrado"
                        })
                    }
                } else if(!req.body.is_teacher){
                    const usr = await User.create({
                        ...user, 
                        alumn:{ 
                            username: req.body.alumn.username
                        }
                    }, {
                        include: {
                            association: 'alumn'
                        }
                });
                if(usr){
                        return res.status(200).json({
                            Status: "Usuário cadastrado"
                        })
                    }
                }
                return res.status(200).json({
                    Status: "Tipo de usuário não disponível"
                })
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
    //ok
    async storeAdmin(req, res){
        try{
            const userVerif = await User.findOne({ where: { email: req.body.email } });
            if(!userVerif){
                let user = req.body;
                if(!req.body.is_google_login){
                    const salt = await bcryptjs.genSalt(10);
                    const hashedPassword = await bcryptjs.hash(req.body.password, salt);
                    user = {
                        ...user,
                        password: hashedPassword
                    }
                } else {
                    user = {
                        ...user,
                        is_google_login: true
                    }
                }
                if(req.body.is_teacher){
                    //user.teacher.username = req.body.teacher.username;
                    const usr = await User.create({
                            ...user
                        }, {
                        include: {
                            association: 'teacher'
                        }
                    });
                    if(usr){
                        return res.status(200).json({
                            Status: "Usuário cadastrado"
                        })
                    }
                } else if(!req.body.is_teacher){
                    const usr = await User.create({
                            ...user
                        }, {
                        include: {
                            association: 'alumn'
                        }
                    });
                    if(usr){
                        return res.status(200).json({
                            Status: "Usuário cadastrado"
                        })
                    }
                }
                const usr = await User.create({
                    ...user
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
    //ok
    async login(req, res) {
        try{
            const user = await User.findOne({ 
                where: { email: req.body.email },
            });
            if(user){
                if(req.body.loginType === 0){
                    if(!user.is_google_login){
                        const validPass = await bcryptjs.compare(req.body.password, user.password)
                        if(!validPass){
                            return res.status(200).json({
                                Status: "Senha incorreta"
                            });
                        }
                    } else {
                        return res.status(200).json({
                            Status: "Email registrado com o google"
                        })
                    }
                } else if(user.password){
                    return res.status(200).json({
                        Status: "Usuário não cadastrado com o google"
                    })
                }
                if(user.is_admin){
                    const admin = await Admin.findByPk(user.id);
                    const  accessToken = generateAccessToken({
                        id: user.id,
                        is_teacher: user.is_teacher,
                        email: user.email,
                        is_admin: user.is_admin
                    });
                    return res.status(200).json({accessToken})
                }
                if(user.is_teacher){
                    const teacher = await Teacher.findByPk(user.id);
                    const  accessToken = generateAccessToken({
                        id: user.id,
                        is_teacher: user.is_teacher,
                        email: user.email,
                        register_finished: teacher.register_finished,
                        is_admin: user.is_admin,
                        form_clicked: user.form_clicked
                    });
                    return res.status(200).json({accessToken})
                }
                //precis lterar pra pegar dados de turma-aluno, turma e quizz-turma
                const alumn = await Alumn.findByPk(user.id);
                const  accessToken = generateAccessToken({
                    id: user.id,
                    is_teacher: user.is_teacher,
                    email: user.email,
                    register_finished: alumn.register_finished,
                    is_admin: user.is_admin,
                    form_clicked: user.form_clicked,
                });
                return res.status(200).json({accessToken});
            }
            return res.status(200).json({
                Status :"Usuário não encontrado"
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            });
        }
    },
    //ok
    async verifPass(req, res){
        const { id } = req.params;
        const { password } = req.body;
        try{
            const user = await User.findByPk(id);
            if(user){
                const validPass = await bcryptjs.compare(password, user.password);
                if(!validPass){
                    return res.status(200).json({
                        Status: "Senha incorreta"
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