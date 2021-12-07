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

require("./src/database");

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/questions", express.static(path.join(__dirname, "public/questions")));

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use(helmet());
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

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/questions");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const storage3 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/questions");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
});

const upload = multer({storage: storage});
app.post("/api/uploadUserImg", upload.single("file"), (req, res) => {
  try{
    if(req.body.old){
      fs.unlink("public/images/" + req.body.old, (err =>{
        if(err) console.log(err)
        else{
          console.log("File deleted");
        }
      }));
    }
    return res.status(200).json("File uploaded!")
} catch(err){
    return res.status(400).json({
      Erro: err
    });
}
});

const upload2 = multer({storage: storage2});
app.post("/api/uploadImg", upload2.array("files"), (req, res) => {
  try{
    console.log('files: ' + req.files);
    return res.status(200).json(req.files);
  } catch(err){
    return res.status(400).json({
      Erro: err
    });
  }
});

const upload3 = multer({storage: storage3});
app.post("/api/uploadImgSingle", upload3.single("file"), (req, res)=>{
  try{
    console.log(req.body.old);
    if(req.body.old){
      fs.unlink("public/questions/" + req.body.old, (err =>{
        if(err) console.log(err)
        else{
          console.log("File deleted");
        }
      }));
    }
    return res.status(200).json("File uploaded!");
  } catch(err){
    return res.status(200).json({
      Status: "Erro interno, " + err
    })
  }
})
app.post("/api/deleteImgSingle", (req, res)=>{
  try{
    if(req.body.old){
      fs.unlink("public/questions/" + req.body.old, (err =>{
        if(err) console.log(err)
        else{
          console.log("File deleted");
        }
      }));
    }
    return res.status(200).json("File uploaded!");
  } catch(err){
    return res.status(200).json({
      Status: "Erro interno, " + err
    })
  }
});

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
          return res.status(200).json(data);
        }
      });

      //return res.status(200).json(nm);
    }
    //return res.status(200).json("Imagem não salva");
  } catch(err){
    return res.status(200).json({
      Status: "Erro interno, " + err
    })
  }
});

app.get("/api/getImage", async(req, res)=>{
  console.log(req.body);
  fs.readFile("public/images/" + req.body.name, 'base64', (err, data)=>{
    if(err) console.log(err);
    res.writeHead(200, {'Content-Type': 'image/webp'});
    res.end(data);
  });
})

app.post("/api/questionSave", upload2.single("file"), async(req, res)=>{
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
        const r = await webp.cwebp(req.file.path, "public/questions/" + nm,"-q 80",logging="-v");
        const bf = fs.readFileSync("public/questions/" + nm);
        /*fs.unlink("public/questions/" + req.file.filename, (err =>{
          if(err) console.log(err)
          else{
            console.log("File deleted");
          }
        }));*/
      }
      return res.status(200).json(nm);
    }
    return res.status(200).json("Imagem não salva");
  } catch(err){
    return res.status(200).json({
      Status: "Erro interno, " + err
    })
  }
});

app.post("/api/convertImage", (req, res)=>{
  try{
    const bf = fs.readFileSync("public/images/" + req.body.old);
    fs.unlink("public/images/" + req.body.old, (err =>{
        if(err) console.log(err)
        else{
          console.log("File deleted");
        }
      }));
    return res.status(200).json(bf.toString('base64'));
  } catch(err){
    return res.status(200).json("Erro, " + err)
  }
})

app.use(routes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`backend is RUNNING!`);
})