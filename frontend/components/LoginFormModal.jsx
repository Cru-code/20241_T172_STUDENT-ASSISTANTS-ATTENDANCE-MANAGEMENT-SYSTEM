import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

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
    Input,
    useDisclosure,
    IconButton,
    VStack,
    Divider,
    Text,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc'; // Google logo icon

function LoginFormModal() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleGoogleSuccess = async (response) => {
        const token = response.credential;

        try {
            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
            const data = await res.json();
            console.log("Backend response:", data);

            // Redirect based on user role
            if (data.user && data.user.role === 'user') {
                navigate('/user');
            } else if (data.user && data.user.role === 'admin') {
                navigate('/admin');
            } else {
                console.error("User data is missing from backend response:", data);
            }

        } catch (error) {
            console.error('Error sending token to backend:', error);
        }
    };

    const handleGoogleFailure = (error) => {
        console.error("Google login failed:", error);
    };

    return (
        <>
            {/* Open Modal Button */}
            <Button onClick={onOpen} colorScheme="blue">Sign in</Button>

            {/* Modal Content */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign in to Your Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            {/* Email Input */}
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" placeholder="Enter your email" />
                            </FormControl>

                            {/* Password Input */}
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" placeholder="Enter your password" />
                            </FormControl>

                            {/* Login Button */}
                            <Button
                                colorScheme="blue"
                                width="full"
                                mt={4}
                                onClick={onClose}
                            >
                                Login
                            </Button>

                            {/* Divider with "or" text */}
                            <Divider />
                            <Text fontSize="sm" color="gray.500">or continue with</Text>

                            {/* Google Login Icon Button */}
                            <GoogleLogin
                                clientId={clientId}
                                onSuccess={handleGoogleSuccess}
                                onFailure={handleGoogleFailure}
                                render={(renderProps) => (
                                    <IconButton
                                        aria-label="Sign in with Google"
                                        icon={<FcGoogle />}
                                        variant="outline"
                                        onClick={renderProps.onClick}
                                        isDisabled={renderProps.disabled}
                                        size="lg"
                                    />
                                )}
                            />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>




        </>
    );
}

export default LoginFormModal;
