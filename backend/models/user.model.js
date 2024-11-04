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
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true // createdAt,
});

const User = mongoose.model('User', userSchema);

export default User;