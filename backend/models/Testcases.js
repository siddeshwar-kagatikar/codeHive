const mongoose = require('mongoose')
const { Schema } = mongoose; 

const TestCasesSchema = new Schema({
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    data: [
        {
            id : {
                type: Number,
                required: true
            },
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ]
})

module.exports = mongoose.model('Testcase', TestCasesSchema)