import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    VStack,
    Input,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { PinInput, PinInputField } from '@chakra-ui/react';  // Import PinInput from Chakra UI

function ForgotPasswordModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: Code, Step 3: New Password
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const toast = useToast();

    const sendResetCode = async () => {
        try {
            const res = await fetch('/api/auth/send-reset-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                toast({ title: 'Reset code sent to your email.', status: 'success' });
                setStep(2);
            } else {
                toast({ title: data.message, status: 'error' });
            }
        } catch (error) {
            toast({ title: 'Failed to send reset code.', status: 'error' });
        }
    };

    const verifyResetCode = async () => {
        try {
            const res = await fetch('/api/auth/verify-reset-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resetCode }),
            });

            const data = await res.json();
            if (res.ok) {
                toast({ title: 'Reset code verified.', status: 'success' });
                setStep(3);
            } else {
                toast({ title: data.message, status: 'error' });
            }
        } catch (error) {
            toast({ title: 'Failed to verify reset code.', status: 'error' });
        }
    };

    const resetPassword = async () => {
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                toast({ title: 'Password reset successful.', status: 'success' });
                onClose();
            } else {
                toast({ title: data.message, status: 'error' });
            }
        } catch (error) {
            toast({ title: 'Failed to reset password.', status: 'error' });
        }
    };

    return (
        <>
            <Button variant="link" colorScheme="blue" onClick={onOpen}>
                Forgot Password?
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reset Your Password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {step === 1 && (
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </FormControl>
                                <Button onClick={sendResetCode} colorScheme="blue" width="full">
                                    Send Reset Code
                                </Button>
                            </VStack>
                        )}
                        {step === 2 && (
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>Reset Code</FormLabel>
                                    <PinInput
                                        otp
                                        value={resetCode}
                                        onChange={(value) => setResetCode(value)}
                                    >
                                        <PinInputField size="lg"
                                            onPaste={(e) => {
                                                const pastedValue = e.clipboardData.getData('text').trim();
                                                if (/^[a-zA-Z0-9]{6}$/.test(pastedValue)) {
                                                    setResetCode(pastedValue);
                                                } else {
                                                    toast({
                                                        title: 'Invalid code format. Please enter a 6-character alphanumeric code.',
                                                        status: 'error',
                                                    });
                                                }
                                                e.preventDefault();
                                            }}
                                        />
                                        <PinInputField size="lg" />
                                        <PinInputField size="lg" />
                                        <PinInputField size="lg" />
                                        <PinInputField size="lg" />
                                        <PinInputField size="lg" />
                                    </PinInput>
                                </FormControl>
                                <Button onClick={verifyResetCode} colorScheme="blue" width="full">
                                    Verify Code
                                </Button>
                            </VStack>
                        )}


                        {step === 3 && (
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>New Password</FormLabel>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </FormControl>
                                <Button onClick={resetPassword} colorScheme="blue" width="full">
                                    Reset Password
                                </Button>
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ForgotPasswordModal;
