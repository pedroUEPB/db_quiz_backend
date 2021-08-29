const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const multer = require("multer");
const path = require("path");
const routes = require("./routes");
const PORT = process.env.PORT;

dotenv.config();

require("./src/database");

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
});
  
const upload = multer({storage});
app.post("/api/uploadUserImg", upload.single("file"), (req, res) => {
  try{
    res.status(200).json("File uploaded!")
    console.log("entrou");
} catch(err){
    return res.status(400).json({
      Erro: err
    });
}
})

app.use(routes);

app.listen(process.env.PORT | PORT, () => {
    console.log(`backend is RUNNING on port: ${process.env.PORT}!`);
})