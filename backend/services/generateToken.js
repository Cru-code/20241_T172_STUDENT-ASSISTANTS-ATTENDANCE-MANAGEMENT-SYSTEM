import { google } from 'googleapis';
import 'dotenv/config';

// Load environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;

// Initialize OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate Auth URL
const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log('Authorize this app by visiting this URL:', authUrl);


const code = '4/0AeanS0YuMJRG2dRd7Kt6sibHPE5Jn5HsqdDs5LNbv-Yrbf6JMIczUj_TtKzTAzSH2Q6Whg&scope=https://mail.google.com/%20https://www.googleapis.com/auth/gmail.compose%20https://www.googleapis.com/auth/gmail.send';
oAuth2Client.getToken(code, (err, token) => {
    if (err) {
        console.error('Error retrieving access token', err);
        return;
    }
    console.log('Your token:', token);
    console.log('Save the refresh_token value to your .env file as GMAIL_REFRESH_TOKEN');
});

