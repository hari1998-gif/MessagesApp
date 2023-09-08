const mongoose = require("mongoose")

const connectDB = async () => {
   console.log(process.env.MONGO_URI)
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected : ${conn.connection.host}`.blue.underline)
    } catch (e) {
        console.log(`Error : ${e.message}`.red.bold)
        process.exit();
    }
};

module.exports = connectDB;