const mongoose = require('mongoose');


const fatiSchema = new mongoose.Schema({
    title: String,
    category: String,
    nameImage: String,
    text: String,
    url: String,
    date: Date
});

module.exports = mongoose.model("posts", fatiSchema);