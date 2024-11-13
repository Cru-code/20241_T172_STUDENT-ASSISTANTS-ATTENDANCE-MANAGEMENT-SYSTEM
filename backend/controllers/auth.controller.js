import pkg from 'google-auth-library';
import User from '../models/user.model.js';

const { OAuth2Client } = pkg;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { token } = req.body;
    console.log("Received Token:", token);

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("Google Payload:", payload);

        const { email, name, picture } = payload;

        // Check if user already exists in the database
        let user = await User.findOne({ email });

        // If user doesn't exist, create a new user with default 'user' role and placeholder designation
        if (!user) {
            user = new User({
                email,
                role: 'user',  // default role
                name,
                designation: "Unassigned", // Default value
                image: picture,
            });
            await user.save();
        }

        res.status(200).json({
            message: 'Google login successful',
            user: { email: user.email, role: user.role, name: user.name, designation: user.designation, image: user.image },
        });
    } catch (error) {
        console.error("Error in googleLogin:", error); // Add this log
        res.status(401).json({ message: 'Google login failed', error });
    }
};
