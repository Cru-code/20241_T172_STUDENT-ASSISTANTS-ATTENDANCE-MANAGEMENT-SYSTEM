import { google } from 'googleapis';
import 'dotenv/config';

// Load environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

// Initialize OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/**
 * Send an email using Gmail API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content of the email
 */
export async function sendEmail({ to, subject, html }) {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const emailContent = [
            `From: "Your App" <your-email@gmail.com>`, // Replace with your Gmail address
            `To: ${to}`,
            `Subject: ${subject}`,
            `Content-Type: text/html; charset="UTF-8"`,
            ``,
            html,
        ].join('\r\n');

        const encodedEmail = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw: encodedEmail },
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Failed to send email:', error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}
