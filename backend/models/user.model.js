import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'user'
    },
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    image: {
        type: String,

    },
    archived: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true // createdAt,
});

const User = mongoose.model('User', userSchema);

export default User;