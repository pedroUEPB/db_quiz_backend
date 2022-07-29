const Contact = require("../models/Contact");

module.exports = {
    async store(req, res) {
        const contact = await Contact.create(req.body);
        if(!contact){
            return res.status(400).json({
                Status: "Contato não enviado"
            })
        }
        return res.status(200).json({
            Status: "Contato enviado!"
        });
    }
}