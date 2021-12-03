const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
            if(err) return res.status(200).json({Status: "Token inválido"});
            req.user = user;
            next();
        })
    } else {
        return res.status(200).json({
            Status: "Não autenticado"
        })
    }
};

const verifyTokenAuth = (req, res, next) => {
    verifyToken(req, res, ()=> {
        const userId = parseInt(req.user.id);
        const paramsId = parseInt(req.params.id);
        if(userId === paramsId || req.user.is_admin){
            next();
        } else {
            return res.status(200).json({
                Status: "Não é possível executar essa ação"
            })
        }
    })
};

const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.is_admin){
            next();
        } else {
            return res.status(200).json({
                Status: "Não é possível executar essa ação"
            })
        }
    })
};

module.exports = { verifyToken, verifyTokenAuth, verifyTokenAdmin };