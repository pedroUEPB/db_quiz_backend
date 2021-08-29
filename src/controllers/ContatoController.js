const Contato = require("../models/Contato");

module.exports = {
    async store(req, res) {
        const contato = await Contato.create(req.body);
        if(!contato){
            return res.status(400).json({
                Err: ["Contato não enviado"]
            })
        }
        return res.status(200).json(contato);
    }
}