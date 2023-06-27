const mongoose = require("mongoose");

const connection_Url = "mongodb+srv://expressdb:expressdb123@cluster0.qwvzk0u.mongodb.net/express";
exports.connect = () => {
    mongoose.connect(connection_Url, {}).then(() => {
        console.log("Database Connected");
    }).catch((e) => {
        console.log("database error " + e);
        process.exit(1);
    });
};
