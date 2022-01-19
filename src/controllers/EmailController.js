const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("../../config");
const User = require("../models/User");
const Turma = require("../models/Turma");
const Notification = require("../models/Notification");
const bcryptjs = require("bcryptjs");

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({ refresh_token: config.refreshToken })

module.exports = {
    async sendContact(req, res) {
        let data = req.body;
        const accessToken = OAuth2_client.getAccessToken();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                refreshToken: config.refreshToken,
                accessToken: accessToken
            }
        })

        let emailSend={
            from: `Screening Programming Suporte <${process.env.EMAIL}>`,
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
            transporter.close();
        })

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
                        const accessToken = OAuth2_client.getAccessToken();
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: 'OAuth2',
                                user: process.env.EMAIL,
                                clientId: config.clientId,
                                clientSecret: config.clientSecret,
                                refreshToken: config.refreshToken,
                                accessToken: accessToken
                            }
                        })
                        const email = transporter.sendMail({
                            from: `Screening Programming <${process.env.EMAIL}>`,
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
        const accessToken = OAuth2_client.getAccessToken();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                refreshToken: config.refreshToken,
                accessToken: accessToken
            }
        })
        //
        try{
            const user = await User.findOne({ where: { email: data.email }});
            if(user){
                if(!user.is_google_login){
                    const turma = await Turma.findOne();
                    let emailSend={
                        from: `Screening Programming <${process.env.EMAIL}>`,
                        to: data.email,
                        subject: "Recuperar conta",
                        html: 
                        `<span>Email de recuperação de conta, para alterar sua senha acesse o <a href="www.screeningprograaming.com/changePass/${data.token}/${user.id}" >Link</a> para alterar sua senha.
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
                            const salt = await bcryptjs.genSalt(10);
                            newUser.password = await bcryptjs.hash(data.pass, salt);
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