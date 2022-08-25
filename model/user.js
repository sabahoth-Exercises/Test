const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Пользовательская схема для базы данных
 */
const UserSchema = new Schema(
    {
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.plugin(uniqueValidator)

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        //do not reveal passwordHash
        delete returnedObject.password
    }
})

const User =  mongoose.model("user", UserSchema);

module.exports = User;