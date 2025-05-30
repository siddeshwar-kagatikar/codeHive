const mongoose = require('mongoose')
const { Schema } = mongoose; 

const CodeSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    qid: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    solved: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Code', CodeSchema)