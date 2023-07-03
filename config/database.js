const mongoose = require("mongoose");

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const connection_Url = "mongodb+srv://"+dbUser+":"+dbPassword+"@"+dbHost+"/express";
exports.connect = () => {
    mongoose.connect(connection_Url, {}).then(() => {
        console.log("Database Connected");
    }).catch((e) => {
        console.log("database error " + e);
        process.exit(1);
    });
};
