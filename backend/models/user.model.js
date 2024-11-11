import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

    },
    email: {
        type: String,
        required: true,
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