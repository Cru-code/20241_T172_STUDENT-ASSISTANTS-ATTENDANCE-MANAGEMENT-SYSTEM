import express from 'express';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

// Redirect user to Google's OAuth2 consent screen
router.get('/auth/google', (req, res) => {
    try {
        const authUrl = getAuthUrl();
        res.redirect(authUrl);
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).send('Error generating auth URL');
    }
});

// Google OAuth2 callback route
router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        setCredentials(tokens); // Store credentials (e.g., in a database)
        res.send('Authentication successful');
    } catch (error) {
        console.error('Error in authentication:', error);
        res.status(500).send('Error during authentication');
    }
});

// Route to send email (authenticated)
router.post('/send-email', async (req, res) => {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).send('Missing email fields (to, subject, body)');
    }

    try {
        await sendEmail(to, subject, body); // Send email using Gmail API
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});

export default router;
