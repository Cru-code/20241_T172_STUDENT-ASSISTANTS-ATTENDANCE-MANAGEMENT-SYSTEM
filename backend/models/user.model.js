import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    role: {
        type: String,
        default: 'user',
    },
    name: {
        type: String,
    },
    designation: {
        type: String,
        default: '',
    },
    image: {
        type: String,
    },
    archived: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: false,
    },
    resetToken: {
        type: String,
        default: null,
    },
    verified: {
        type: Boolean,
        default: false, // Indicates if the user's email is verified
    },
    verificationToken: {
        type: String, // Stores the hashed version of the verification token
        default: null,
    },
}, {
    timestamps: true, // Automatically includes createdAt and updatedAt fields
});

// Index to improve email-based search performance
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
