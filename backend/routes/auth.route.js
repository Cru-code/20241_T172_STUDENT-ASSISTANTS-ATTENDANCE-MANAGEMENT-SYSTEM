import express from 'express';
import { checkVerificationStatus, googleLogin, loginUser, resetPassword, sendResetCode, verifyEmail, verifyResetCode } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/google', googleLogin);
router.post('/login', loginUser);
router.post('/send-reset-code', sendResetCode);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);
router.get('/check-verification', checkVerificationStatus);

export default router;
