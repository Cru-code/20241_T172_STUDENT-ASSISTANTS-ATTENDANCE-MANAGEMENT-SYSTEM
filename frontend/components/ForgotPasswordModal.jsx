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
    HStack,
    Input,
    useDisclosure,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import { PinInput, PinInputField } from '@chakra-ui/react';

function ForgotPasswordModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [step, setStep] = useState(1); // Step 1: Email, Step 2: Code, Step 3: New Password
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSending, setIsSending] = useState(false); // Track if the reset code is being sent
    const toast = useToast();

    const handleModalClose = () => {
        // Reset everything when the modal is closed
        setStep(1);
        setEmail('');
        setResetCode('');
        setNewPassword('');
        setIsSending(false);
        onClose();
    };

    const sendResetCode = async () => {
        setIsSending(true); // Disable button and show loading state
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
        } finally {
            setIsSending(false); // Re-enable button if necessary for retries
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
                handleModalClose(); // Close the modal after resetting
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
            <Modal isOpen={isOpen} onClose={handleModalClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reset Your Password</ModalHeader>
                    <ModalCloseButton onClick={handleModalClose} />
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
                                {!isSending ? (
                                    <Button onClick={sendResetCode} colorScheme="blue" width="full">
                                        Send Reset Code
                                    </Button>
                                ) : (
                                    <Button isDisabled colorScheme="blue" width="full">
                                        <Spinner size="sm" mr={2} /> Sending...
                                    </Button>
                                )}
                            </VStack>
                        )}
                        {step === 2 && (
                            <VStack spacing={6}>
                                <FormControl>
                                    <FormLabel>Reset Code</FormLabel>
                                    <HStack justifyContent="center" spacing={4}>
                                        <PinInput
                                            otp
                                            value={resetCode}
                                            onChange={(value) => setResetCode(value)}
                                            type="alphanumeric"
                                            size="lg"
                                        >
                                            {[...Array(6)].map((_, i) => (
                                                <PinInputField key={i} />
                                            ))}
                                        </PinInput>
                                    </HStack>
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
                        <Button onClick={handleModalClose} variant="ghost">
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ForgotPasswordModal;
