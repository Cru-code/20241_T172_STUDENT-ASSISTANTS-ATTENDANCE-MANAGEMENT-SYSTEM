import express from 'express';
import { googleLogin, loginUser, resetPassword, sendResetCode, verifyResetCode } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/google', googleLogin);
router.post('/login', loginUser);
router.post('/send-reset-code', sendResetCode);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;
