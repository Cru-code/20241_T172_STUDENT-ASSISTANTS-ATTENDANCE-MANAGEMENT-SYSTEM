import pkg from 'google-auth-library';
const { OAuth2Client } = pkg;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user already exists in the database
        let user = await User.findOne({ email });

        // If user doesn't exist, create a new user with a default 'user' role
        if (!user) {
            user = new User({
                name,
                email,
                image: picture,
                designation: 2 // Default to regular user
            });

            console.log("User created:", user);
            await user.save();
        }

        // Use `payload` to find or create a user in your database
        res.status(200).json({
            message: 'Google login successful',
            user: { email: user.email, role: user.role }  // Send role to frontend
        });
    } catch (error) {
        res.status(401).json({ message: 'Google login failed', error });
    }
};
