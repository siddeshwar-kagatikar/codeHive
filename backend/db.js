const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://siddeshwar2004:vLI5QBr6jehHi2ro@cluster0.ztj4d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI); 
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectToMongo;
