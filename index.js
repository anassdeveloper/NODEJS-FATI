require("dotenv").config();
const express = require("express");
const multiparty = require("multiparty");
const mongoose = require("mongoose");
const Fati = require('./models/fatiModel');
let cors = require("cors");

const ex = express();
const PORT = process.env.PORT || 4000;
//const URI = "mongodb://0.0.0.0:27017/fati";
const IMAGE_UPLOAD_DIR = "./public/images";
//const IMAGE_BASE_URL = "http://localhost:4000/images/";

mongoose.set('strictQuery', false);
// production url : process.env.MONGO_URI

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
       console.log(`MongoDB connected : ${conn.connection.host}`)
    }catch(err){
        console.log(err)
        process.exit();
    }
}



//MIDDELWARES

ex.use(express.static('public'));
ex.use(cors());
ex.use(express.json());

//https://sparkling-swimsuit-fawn.cyclic.app
// ROUTES
ex.get("/", (req, res) => res.send('HOME PAGE'));

ex.delete("/del-post/:id", async (req, res) => {
    const { id } = req.params;
    let post = await Fati.findOneAndDelete(id);

    if(!post) return res.status(404).json('That id not found');

    res.json(post);
})

ex.post("/add-post", (req, res) => {
    res.status(202).json(req.body)
    /*
    // Create form || Multiparty
    let form = new multiparty.Form({
        uploadDir: IMAGE_UPLOAD_DIR
    });

    // parse data from Request

    form.parse(req, function(err, fields, files){
        if(err) return res.status(500).send('Somthing wroong');

        //console.log(`Fields = ${JSON.stringify(fields, null, 2)}`)
        //console.log(`Files = ${JSON.stringify(files, null, 2)}`);
        //console.log(files.files[0].path)
        let defaultPath = files.files[0].path;
        let imageName = defaultPath.slice(defaultPath.lastIndexOf("\\") + 1);
        //let originalImagePath = IMAGE_BASE_URL + imageName;
        let newPost = {
            title: fields.title[0],
            category: fields.category[0],
            nameImage: imageName,
            text: fields.text[0],
            url: fields.link[0],
            date: '09-04-2023'
        };
        res.json(newPost);
        /*
        let post = new Fati(newPost);
        post.save()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json("field"))

       
    })
      */
})

ex.get("/data/posts", async (req, res) => {
    try{
        const data = await Fati.find();
        if(!data) return res.json("No data");
        res.status(200).json(data);

    }catch(err){
        res.status(500).json(err)
    }
})

connectDB().then(() => {
ex.listen(PORT, () => console.log("http://localhost:" + PORT));
});