const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

const Message = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    nameUser: {
        type: String
    }
    ,
    status: {
        type: String,
        default: 'PENDING',
        enum: ['PENDING', 'READED'],
    },
    sentTo: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    nameSentTo: {
        type: String
    },
    sentDate:{
        type: Date,
    }
})


const User = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date
    },
    sex: {
        type: String,
        default: 'MALE',
        enum: ['MALE', 'FEMALE'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true  
    },
    presentation: {
        type: String,
        required: true 
    },
    contacts: {
        type: Array,
        required: true  
    },
    lastView: {
        type: Number,  
        type: ObjectId,
        ref: 'User'
    },
    minAgePref: {
        type: Number,
        required: true  
    },
    maxAgePref: {
        type: Number,
        required: true  
    },
    photo1: {
        type: String,
        default: '#'
    },
    photo2: {
        type: String,
        default: '#'
    },
    photo3: {
        type: String,
        default: '#'
    },
    
    blocks: {
        type: Array,
        required: true 
    },
    
    blockedBy: {
        type: Array,
        required: true
    }
    
})

module.exports = {
    Message,
    User
}

