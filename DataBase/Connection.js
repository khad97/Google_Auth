const mongoose = require('mongoose');
require('dotenv/config');

const URL = process.env.DB_CONNECTION;

const connectDB = async() => {
    await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("DB Connected");
};

module.exports = connectDB;