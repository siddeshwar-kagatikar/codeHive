// const mongoose = require('mongoose');
// // const mongoURI = 'mongodb+srv://siddeshwar2004:vLI5QBr6jehHi2ro@cluster0.ztj4d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const mongoURI = 'mongodb+srv://siddeshwar2004:vLI5QBr6jehHi2ro@cluster0.ztj4d.mongodb.net/'

// const connectToMongo = async () => {
//     try {
//         await mongoose.connect(mongoURI); 
//         console.log('Connected to MongoDB');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//     }
// };

// module.exports = connectToMongo;


const mongoose = require("mongoose");

const connectToMongo = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Stop app if DB fails
  }
};

module.exports = connectToMongo;
