const nodemailer = require("nodemailer");
const User = require("../models/User");
const Turma = require("../models/Turma");
const Notification = require("../models/Notification");
const TurmaAluno = require("../models/TurmaAluno");
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
        const { dados, emails, title } = req.body;
        //
        try{
            let Status = "Não enviado";
            if(emails?.length > 0){
                for(i=0; i<emails.length; i++){
                    const eml = new Promise((resolve, reject)=>{
                        let transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: 587,
                            secure: false,
                            auth: {
                                user: "programmingscreening@gmail.com",
                                pass: "SPS123456@"
                            }
                        });
                        const email = transporter.sendMail({
                            from: `Screening Programming <programmingscreening@gmail.com>`,
                            to: emails[i].email,
                            subject: "Convite",
                            html: `<span>Convite para participar do grupo ${title}.
                            Acesse sua conta para aceitar a solicitação.
                            </span>
                            `
                        }, (error, response) => {
                            console.log("aqui");
                            if (error) {
                                console.log(error);
                                resolve(false);
                            }
                            resolve(true);
                        })
                    })
                    if(eml){
                        Status = "Convite enviado";
                    }
                }
                if(Status === "Convite enviado"){
                    await Notification.bulkCreate(dados.notificacoes);
                }
            }
            return res.status(200).json({
                Status
            })
        } catch(err){
            return res.status(200).json({
                Status: "erro interno, " +err
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
            if(user){
                if(!user.is_google_login){
                    const turma = await Turma.findOne();
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
                        Status: "Usuário cadastrado com o google!"
                    })
                }
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