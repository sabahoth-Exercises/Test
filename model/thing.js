const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * схема продукта для базы данных
 */
const UserSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

UserSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        //do not reveal passwordHash
        delete returnedObject.password
    }
})

const User =  mongoose.model("thing", UserSchema);

module.exports = User;
