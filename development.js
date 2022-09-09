const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const multer = require("multer");
const path = require("path");
const routes = require("./routes");
const fs = require("fs");
const webp = require("webp-converter");
const bodyParser = require("body-parser");
const allowCors = require("./src/config/cors");

require("./src/database/config_dev");

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/questions", express.static(path.join(__dirname, "public/questions")));

/*app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});*/

app.use(helmet());
app.use(cors());
app.use(allowCors);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
});

const upload = multer({storage: storage});

app.post("/api/saveImage", upload.single("file"), async(req, res)=>{
  try{
    if(req.file){
      const vetor = req.file.filename.split(".");
      let nm = vetor[0];
      const format = vetor[vetor.length - 1];
      if(nm === ""){
        nm = Date.now();
      }
      nm = nm + ".webp";
      if(format !== "webp"){
        const r = await webp.cwebp(req.file.path, "public/images/" + nm,"-q 80",logging="-v");
        fs.unlink("public/images/" + req.file.filename, (err =>{
          if(err) console.log(err)
          else{
            console.log("File deleted");
          }
        }));
      }
      fs.readFile("public/images/" + nm, 'base64', (err, data)=>{
        if(err) console.log(err);
        if(data){
          fs.unlink("public/images/" + nm, (err =>{
            if(err) console.log(err)
            else{
              console.log("File deleted");
            }
          }));
          return res.status(200).json(data);
        }
      });
    }
  } catch(err){
    return res.status(200).json({
      Status: "Erro interno, " + err
    })
  }
});

app.use(routes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`DEVELOPMENT backend is RUNNING! ${process.env.PORT}`);
})