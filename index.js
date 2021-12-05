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

require("./src/database");

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/questions", express.static(path.join(__dirname, "public/questions")));

app.use(cors());
app.options("*", cors());
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
      let nm = req.file.filename.split(".")[0];
      if(nm === ""){
        nm = Date.now();
      }
      const r = await webp.cwebp(req.file.path, "public/images/" + nm + ".webp","-q 80",logging="-v");
      fs.unlink("public/images/" + req.file.filename, (err =>{
        if(err) console.log(err)
        else{
          console.log("File deleted");
        }
      }));
      console.log(r);
      const bf = fs.readFileSync("public/images/" + nm + ".webp");
      return res.status(200).json(bf);
      /*result.then((response) => {
        imgName = response;
      });
      /*const bf = fs.readFileSync("public/images/" + req.body.old);
      fs.unlink("public/images/" + req.body.old, (err =>{
        if(err) console.log(err)
        else{
          console.log("File deleted");
        }
      }));
      return res.status(200).json(bf.toString('base64'));*/
    }
    return res.status(200).json("Imagem não salva");
  } catch(err){
    return res.status(200).json({
      Status: "Erro interno, " + err
    })
  }
});
app.post("/api/saveQuestion", upload2.single("file"), async(req, res)=>{
  try{
    if(req.file){
      console.log("saving question");
      let nm = req.file.filename.split(".")[0];
      if(nm === ""){
        nm = Date.now();
      }
      const r = await webp.cwebp(req.file.path, "public/questions/" + nm + ".webp","-q 80",logging="-v");
      fs.unlink("public/questions/" + req.file.filename, (err =>{
        if(err) console.log(err)
        else{
          console.log("File deleted");
        }
      }));
      const bf = fs.readFileSync("public/questions/" + nm + ".webp");
      return res.status(200).json(nm + ".webp");
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