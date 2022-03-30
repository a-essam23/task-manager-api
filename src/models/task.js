const  mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type:String,
        required:true,
        trim: true
    },
    completion: {
        type:Boolean,
        default:false,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User',
    }
}, {timestamps:true})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task