import bcrypt from 'bcrypt';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail } from '../services/emailService.js';
import { AppError } from '../middlewares/errorMiddleware.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Google Login

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        if (!token) {
            return res.status(400).json({ success: false, message: 'Google ID Token is missing' });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // New user creation
            const randomPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const verificationTokenValue = jwt.sign(
                { email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            const hashedToken = crypto.createHash('sha256').update(verificationTokenValue).digest('hex');

            user = new User({
                email,
                name,
                image: picture,
                password: hashedPassword,
                role: 'user',
                verified: false,
                verificationToken: hashedToken,
            });

            await user.save();

            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationTokenValue}`;
            await sendEmail({
                to: email,
                subject: 'Verify Your Email',
                html: `
                    <p>Hello ${name},</p>
                    <p>Welcome to our platform! Please verify your email address:</p>
                    <a href="${verificationUrl}">Verify Email</a>
                `,
            });

            return res.status(200).json({
                success: true,
                message: 'A verification email has been sent. Please verify to proceed.',
                email,
            });
        } else if (!user.verified) {
            return res.status(400).json({
                success: false,
                message: 'Your email is not verified. Please verify your email to continue.',
            });
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
            },
            token: jwtToken,
        });
    } catch (error) {
        console.error('Google Login Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Manual Login
export const loginUser = async (req, res) => {
    const { email, password, recaptcha_token } = req.body;

    if (!recaptcha_token) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA token is missing.' });
    }

    try {
        // Verify reCAPTCHA token
        const recaptchaResponse = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: RECAPTCHA_SECRET_KEY,
                    response: recaptcha_token,
                },
            }
        );

        if (!recaptchaResponse.data.success) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reCAPTCHA.' });
        }

        // Check user credentials
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const sendResetCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const resetCode = crypto.randomBytes(3).toString('hex'); // Example: 'f4a7b6'
        const resetToken = jwt.sign({ resetCode, email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        user.resetToken = resetToken; // Save token to the user
        await user.save();

        // Send email
        await sendEmail({
            to: email,
            subject: 'Password Reset Code',
            html: `<p>Your password reset code is: <strong>${resetCode}</strong></p><p>This code is valid for 15 minutes.</p>`,
        });

        res.status(200).json({ success: true, message: 'Reset code sent to your email.' });
    } catch (error) {
        console.error('Error sending reset code:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Verify Reset Code
export const verifyResetCode = async (req, res) => {
    const { email, resetCode } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.resetToken) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
        }

        const decoded = jwt.verify(user.resetToken, process.env.JWT_SECRET);
        if (decoded.resetCode !== resetCode) {
            return res.status(400).json({ success: false, message: 'Invalid reset code.' });
        }

        res.status(200).json({ success: true, message: 'Reset code verified.' });
    } catch (error) {
        console.error('Error verifying reset code:', error.message);
        res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
    }
};


// Reset Password
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetToken = null; // Clear token
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful.' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(new AppError('Error fetching users', 500)); // Use custom error
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ success: false, message: "Verification token is missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({ verificationToken: hashedToken });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid or expired verification token." });
        }

        // Generate random password and hash it
        const randomPassword = crypto.randomBytes(8).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Update user information
        user.verified = true;
        user.verificationToken = null;
        user.password = hashedPassword; // Save the hashed password
        await user.save();

        // Send the random password to the user's email
        await sendEmail({
            to: user.email,
            subject: "Your New Password",
            html: `<p>Your account has been verified successfully. Use the password below to log in:</p>
                   <p><strong>${randomPassword}</strong></p>
                   <p>You can change your password after logging in.</p>`,
        });

        // Generate JWT token for the user
        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Email successfully verified! A random password has been sent to your email.",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            token: jwtToken,
        });
    } catch (error) {
        console.error("Error during email verification:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};









export const checkVerificationStatus = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.verified) {
            // Generate a JWT token (if applicable)
            const jwtToken = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                success: true,
                verified: true,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token: jwtToken,
                redirectUrl: user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard',
            });
        }

        res.status(200).json({ success: true, verified: false });
    } catch (error) {
        console.error('Error checking verification status:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};




