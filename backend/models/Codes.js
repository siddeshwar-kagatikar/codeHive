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
    code: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Code', CodeSchema)