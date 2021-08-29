const router = require("express").Router();
const User = require("../models/User");
const Professor = require("../models/Professor");
const Aluno = require("../models/Aluno");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");


module.exports = {
    //REGISTERS
    //Professor
    async storeProfessor(req, res) {
        try{
            const userVerif = await User.findOne({ where: { email: req.body.email } });
            if(!userVerif){
                if(!req.body.is_google_login){
                    //gerar uma senha codificada
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.password, salt);
                    //criar usuário
                    const newUser = new User({
                        email: req.body.email,
                        password: hashedPassword,
                        is_professor: req.body.is_professor,
                        is_google_login: req.body.is_google_login,
                        is_admin: req.body.is_admin
                    });
                    const user = await newUser.save();
                    const newProfessor = new Professor({
                        id: user.id,
                        username: req.body.username,
                        profile_picture: req.body.profile_picture,
                        register_count: req.body.register_count,
                    })
                    console.log(newProfessor);
                    const professor = await newProfessor.save();
                    return res.status(200).json({
                        Status: ["Usuário cadastrado!"]
                    });
                }
                const newUser = new User({
                    email: req.body.email,
                    is_professor: req.body.is_professor,
                    is_google_login: req.body.is_google_login,
                    is_admin: req.body.is_admin
                })
                //salvar usuário
                const user = await newUser.save();
                const newProfessor = new Professor({
                    id: user.id,
                    username: req.body.username,
                    profile_picture: req.body.profile_picture,
                    register_count: req.body.register_count,
                })
                const professor = await newProfessor.save();
                return res.status(200).json({
                    Status: ["Usuário cadastrado!"]
                });
            }
            return res.status(200).json({
                Status : ["Email já cadastrado!"]
            });
        } catch(err){
            return res.status(200).json({
                Status: ["Erro interno"]
            });
        }
    },
    //Aluno
    async storeAluno(req, res) {
        try{
            console.log(req.body);
            const userVerif = await User.findOne({ where: { email: req.body.email } });
            if(!userVerif){
                if(!req.body.is_google_login){
                    //gerar uma senha codificada
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.password, salt);
                    //criar usuário
                    const newUser = new User({
                        email: req.body.email,
                        password: hashedPassword,
                        is_professor: req.body.is_professor,
                        is_google_login: req.body.is_google_login,
                        is_admin: req.body.is_admin
                    });
                    const user = await newUser.save();
                    const newAluno = new Aluno({
                        id: user.id,
                        username: req.body.username,
                        profile_picture: req.body.profile_picture,
                        register_count: req.body.register_count,
                    })
                    console.log(newAluno);
                    const aluno = await newAluno.save();
                    return res.status(200).json({
                        Status: ["Usuário cadastrado!"]
                    });
                }
                const newUser = new User({
                    email: req.body.email,
                    is_professor: req.body.is_professor,
                    is_google_login: req.body.is_google_login,
                    is_admin: req.body.is_admin
                })
                //salvar usuário
                const user = await newUser.save();
                const newAluno = new Aluno({
                    id: user.id,
                    username: req.body.username,
                    profile_picture: req.body.profile_picture,
                    register_count: req.body.register_count,
                })
                const aluno = await newAluno.save();
                return res.status(200).json({
                    Status: ["Usuário cadastrado!"]
                });
            }
            return res.status(200).json({
                Status : ["Email já cadastrado!"]
            });
        } catch(err){
            return res.status(200).json({
                Status: ["Erro interno"]
            });
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
                const validPass = await bcrypt.compare(req.body.password, user.password)
                if(!validPass){
                    return res.status(200).json({
                        Status: "Senha incorreta!"
                    });
                }
            }
            if(user.is_admin){
                const admin = await Admin.findByPk(user.id);
                const { password, created_at, updated_at, ...otherUser } = user.dataValues;
                const { username, profile_picture, ...other } = admin.dataValues;
                return res.status(200).json(Object.assign({}, otherUser, {username, profile_picture}));
            }
            if(user.is_professor){
                const professor = await Professor.findByPk(user.id);
                const { password, created_at, updated_at, ...otherUser } = user.dataValues;
                const { username, profile_picture, ...other } = professor.dataValues;
                return res.status(200).json(Object.assign({}, otherUser, {username, profile_picture}));
                //res.status(200).json();
            }
            //precis lterar pra pegar dados de turma-aluno, turma e quizz-turma
            const aluno = await Aluno.findByPk(user.id, {
                include: { association: 'turmas'}
            });
            const { email, is_professor, is_google_login, ...otherUser } = user.dataValues;
            const { created_at, updated_at, ...other } = aluno.dataValues;
            return res.status(200).json(Object.assign({}, other, {email, is_professor, is_google_login}));
        } catch(err){
            res.status(200).json({
                Status : ["Erro interno"]
            });
        }
    },
    //Admin
    async storeAdmin(req, res) {
        try{
            const userVerif = await User.findOne({ where: { email: req.body.email } });
            if(!userVerif){
                //gerar uma senha codificada
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                //criar usuário
                const newUser = new User({
                    email: req.body.email,
                    password: hashedPassword,
                    is_professor: req.body.is_professor,
                    is_google_login: req.body.is_google_login,
                    is_admin: req.body.is_admin
                });
                const user = await newUser.save();
                const newAdmin = new Admin({
                    id: user.id,
                    username: req.body.username,
                    profile_picture: req.body.profile_picture,
                })
                const admin = await newAdmin.save();
                if(admin){
                    return res.status(200).json({
                        Status: ["Usuário cadastrado!"]
                    });
                }
                return res.status(200).json({
                    Status: ["Não foi possóvel criar o usuário"]
                })
            } else {
                return res.status(200).json({
                    Status: ["Email já cadastrado!"]
                })
            }
        } catch(err){
            return res.status(200).json({
                Status : ["Erro interno"]
            });
        }
    }
}