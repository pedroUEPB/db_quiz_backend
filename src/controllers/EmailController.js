const nodemailer = require("nodemailer");
const User = require("../models/User");
const Turma = require("../models/Turma");
const Notification = require("../models/Notification");
const bcrypt = require("bcrypt");

module.exports = {
    async sendContact(req, res) {
        let data = req.body;
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "programmingscreening@gmail.com",
                pass: "SPS123456@"
            }
        });

        let emailSend={
            from: `Screening Programming Suporte`,
            to: "programmingscreening@gmail.com",
            subject: data.subject,
            html: `
            <h1>Mensagem de ${data.username} <${req.body.email}></h1>
            <h3>${data.message}</h3>
            `
        }

        await transporter.sendMail(emailSend, (error, response) => {
            if(error){
                res.send(error);
            } else {
                res.send("Mensagem enviada!");
            }
        })

        transporter.close();
    },
    //convite para turma
    async sendAlunoConvite(req, res) {
        const dados = req.body;
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "programmingscreening@gmail.com",
                pass: "SPS123456@"
            }
        });
        //
        try{
            const aluno = await User.findOne({ where: { email: dados.email }});
            if(aluno){
                if(!aluno.is_professor){
                    const turma = await Turma.findOne({ where: { id: dados.turma_id }});
                    if(turma){
                        //rota = http://localhost:3000/acceptRequest/:professor_id/:aluno_id
                        let emailSend={
                            from: `Screening Programming <programmingscreening@gmail.com>`,
                            to: dados.email,
                            subject: "Convite",
                            html: 
                            `<span>Convite para participar da turma ${turma.title}.
                            Acesse sua conta para aceitar a solicitação.
                            </span>
                            `
                        }

                        await transporter.sendMail(emailSend, async(error, response) => {
                            if(error){
                                return res.status(200).json({
                                    Status: ["Erro ao enviar o convite!"]
                                })
                            } else {
                                const notification = {
                                    turma_id: turma.id,
                                    aluno_id: aluno.id,
                                    title: "Convite para turma",
                                    message: `Você foi convidado para participar da turma "${turma.title.toUpperCase()}".`
                                }
                                await Notification.create(notification);
                                return res.status(200).json({
                                    Status: ["Convite enviado"],
                                    aluno_id: aluno.id
                                })
                            }
                        })
                        transporter.close();
                    } else {
                        return res.status(200).json({
                            Status: ["Turma não existe"]
                        })
                    }
                } else{
                    return res.status(200).json({
                        Status: ["O email não pertence a um aluno"]
                    })
                }
            } else{
                return res.status(200).json({
                    Status: ["O email não esta cadastrado no sistema!"]
                })
            }
        } catch(err){
            return res.status(200).json({
                Status: [err]
            })
        }
    },
    async recover(req, res){
        const data = req.body;
        //console.log(data);
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "programmingscreening@gmail.com",
                pass: "SPS123456@"
            }
        });
        //
        try{
            const user = await User.findOne({ where: { email: data.email }});
            const turma = await Turma.findOne();
            if(user){
                //rota = http://localhost:3000/acceptRequest/:professor_id/:aluno_id
                let emailSend={
                    from: `Screening Programming <programmingscreening@gmail.com>`,
                    to: data.email,
                    subject: "Recuperar conta",
                    html: 
                    `<span>Email de recuperação de conta, para alterar sua senha acesse o <a href="http://localhost:3000/changePass/${data.token}/${user.id}" >Link</a> para alterar sua senha.
                    </span>
                    
                    `
                }

                await transporter.sendMail(emailSend, async(error, response) => {
                    if(error){
                        return res.status(200).json({
                            Status: ["Erro ao enviar email"]
                        })
                    } else {
                        const newUser = user;
                        const salt = await bcrypt.genSalt(10);
                        newUser.password = await bcrypt.hash(data.pass, salt);
                        await user.save(newUser);
                        const notification = {
                            turma_id: turma.id,
                            aluno_id: user.id,
                            title: data.token,
                            message: "trocar senha"
                        }
                        await Notification.create(notification);
                        return res.status(200).json({
                            Status: "Enviado"
                        })
                    }
                })
                transporter.close();
            } else {
                return res.status(200).json({
                    Status: "Usuário não encontrado"
                })
            }
        } catch (err){
            return res.status(200).json({
                Status: "Erro interno"
            })
        }
        
    }
}