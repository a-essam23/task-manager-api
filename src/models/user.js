const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Task = require('./task')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        //unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(mail) {
            if (!validator.isEmail(mail)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
    }
    ,
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(pass) {

            if (pass.toLowerCase().includes("password")) {
                throw new Error('Password cannot contain "password". Please choose a new password.')
            }

        }
    }, avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, { timestamps: true })

// Authenticate user for log in
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('This email does not exist')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('This password is incorrect')
    }

    return user
}

// Generate Authorization token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token

}

// Filter data outputed when sending "user" object
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.__v
    delete userObject._id
    delete userObject.avatar
    delete userObject.createdAt
    delete userObject.updatedAt

    return userObject
}

// Hash the password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }


    next()
})


// Set up a Virtual Property 
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'createdBy',
})


// Delete all user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ createdBy: user._id })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User