const mongoose = require('mongoose')
const { Schema } = mongoose; 

const QuestionSchema = new Schema({
    roomId: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        required: true,
        unique: true
    },
    question: {
        type: String,
        required: true
    },
    example: {
        type: String,
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Question', QuestionSchema)