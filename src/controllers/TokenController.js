const RefreshTokens = require("../models/RefreshToken");
const User = require("../models/User");
const Professor = require("../models/Professor");
const Aluno = require("../models/Aluno");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign({ 
        id: user.id,
        is_professor: user.is_professor,
        is_admin: user.is_admin,
        register_finished: user.register_finished, 
        profile_picture: user.profile_picture,
        turmas: user.turmas,
     }, "SP81I3V41g7v1t8i124Y517G5V5i34y19g1v831i27NV94M23Y", {
      expiresIn: "15s",
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ 
        id: user.id,
        is_professor: user.is_professor,
        is_admin: user.is_admin,
        register_finished: user.register_finished, 
        profile_picture: user.profile_picture,
        turmas: user.turmas,
     }, "SPdg58x41s8N1248R2G471D828E184X1hS85j5d82r58e25x85");
};

const generateAccessToken2 = (user) => {
    return jwt.sign(user, "SP81I3V41g7v1t8i124Y517G5V5i34y19g1v831i27NV94M23Y", {
      expiresIn: "15s",
    });
};

const generateRefreshToken2 = (user) => {
    return jwt.sign(user, "SPdg58x41s8N1248R2G471D828E184X1hS85j5d82r58e25x85");
};

module.exports = {
    //CREATE QUIZZ
    async update(req, res) {
        const refreshToken = req.body.token;
        try{
            console.log("-----token-----")
            //console.log(refreshToken);
            if (!refreshToken){
                return res.status(401).json("You are not authenticated!");
            }
            const refreshTokens = await RefreshTokens.findOne({where: {refresh_token: req.body.token}});
            //console.log(refreshTokens.length);
            console.log("...");
            if (!refreshTokens) {
                return res.status(200).json({
                    Status: "Refresh token is not valid!"
                });
            }
            jwt.verify(refreshToken, "SPdg58x41s8N1248R2G471D828E184X1hS85j5d82r58e25x85", async (err, user) => {
                err && console.log(err);
                //refreshTokens = refreshTokens.filter((token) => token.refresh_token !== refreshToken);

                if(user.is_admin){
                    const admin = await Admin.findByPk(user.id);
                    const  accessToken = generateAccessToken({
                        id: user.id,
                        is_professor: user.is_professor,
                        email: user.email,
                        is_admin: user.is_admin,
                    });
                    const  refreshToken = generateRefreshToken({
                        id: user.id,
                        is_professor: user.is_professor,
                        email: user.email,
                        is_admin: user.is_admin,
                    });
                    const token = new RefreshTokens({
                        refresh_token: refreshToken
                    })
                    await refreshTokens.save({refresh_token: refreshToken});
                    return res.status(200).json({
                        username: admin.username,
                        profile_picture: admin.profile_picture,
                        is_admin: user.is_admin,
                        accessToken,
                        refreshToken
                    })
                }
                if(user.is_professor){
                    const professor = await Professor.findByPk(user.id);
                    const  accessToken = generateAccessToken({
                        id: user.id,
                        is_professor: user.is_professor,
                        email: user.email,
                        is_admin: user.is_admin,
                    });
                    const  refreshToken = generateRefreshToken({
                        id: user.id,
                        is_professor: user.is_professor,
                        email: user.email,
                        is_admin: user.is_admin,
                    });
                    const token = new RefreshTokens({
                        refresh_token: refreshToken
                    })
                    await token.save();
                    return res.status(200).json({
                        username: professor.username,
                        profile_picture: professor.profile_picture,
                        is_admin: user.is_admin,
                        accessToken,
                        refreshToken
                    })
                }
                const aluno = await Aluno.findByPk(user.id,{
                    include: {
                        association: 'turmas'
                    }
                });
                const  accessToken = generateAccessToken({
                    id: user.id,
                    is_professor: user.is_professor,
                    is_admin: user.is_admin,
                    register_finished: aluno.register_finished, 
                    profile_picture: aluno.profile_picture,
                    turmas: aluno.turmas,
                });
                const  refreshToken = generateRefreshToken({
                    id: user.id,
                    is_professor: user.is_professor,
                    is_admin: user.is_admin,
                    register_finished: aluno.register_finished, 
                    profile_picture: aluno.profile_picture,
                    turmas: aluno.turmas,
                });
                await refreshTokens.update({refresh_token: refreshToken});
                return res.status(200).json({
                    username: aluno.username,
                    profile_picture: aluno.profile_picture,
                    is_admin: user.is_admin,
                    is_professor: user.is_professor,
                    register_finished: aluno.register_finished,
                    accessToken,
                    refreshToken
                })
            });
        } catch(err){
            return res.status(200).json({
                Status: "Erro interno, " + err
            })
        }
    },
    async store(req, res){
        const { userVariables } = req.body;
        try{
            const accessToken = generateAccessToken2(userVariables);
            const refreshToken = generateRefreshToken2(userVariables);
            return res.status(200).json({accessToken, refreshToken});
        } catch(err){
            return res.status(200).json({
                Status: "erro interno, " + err
            })
        }
    },
    async delete(req, res){
        const { refreshToken } = req.params;
        //console.log(req.params);
        try{
            const token = await RefreshTokens.findOne({ where: { refresh_token: refreshToken }});
            if(token){
                await token.destroy();
                return res.status(200).json({
                    Status: "Token apagado"
                })
            }
            return res.status(200).json({
                Status: "Token não encontrado"
            })
        } catch(err){
            return res.status(200).json({
                Status: "erro interno, " + err
            })
        }
    }
}