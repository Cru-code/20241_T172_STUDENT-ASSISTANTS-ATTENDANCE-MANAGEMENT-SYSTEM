import React, { useState, useRef } from "react";
import { GoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
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
    VStack,
    Divider,
    Text,
    useToast,
} from "@chakra-ui/react";
import VerificationStatus from "./VerificationStatus.jsx"; // Import VerificationStatus
import ForgotPasswordModal from "./ForgotPasswordModal.jsx"; // Import ForgotPasswordModal
import { useNavigate } from "react-router-dom";

function LoginFormModal() {
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState("");
    const recaptchaRef = useRef(null);
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    // Handle Google login success
    const handleGoogleSuccess = async (response) => {
        const token = response.credential;

        try {
            const res = await fetch("http://localhost:5000/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.message && data.message.includes("verification email")) {
                    setVerificationEmail(data.email);
                    setIsVerifying(true);
                    toast({
                        title: "Verification Required",
                        description: data.message,
                        status: "info",
                        duration: 3000,
                    });
                } else {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    localStorage.setItem("token", data.token);
                    navigate(data.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
                }
            } else {
                toast({ title: data.message, status: "error", duration: 3000 });
            }
        } catch (error) {
            console.error("Google login failed:", error);
            toast({ title: "Google login failed. Please try again.", status: "error", duration: 3000 });
        }
    };


    // Handle standard login
    const handleLogin = async () => {
        if (!recaptchaToken) {
            toast({ title: "Please complete the reCAPTCHA.", status: "error", duration: 3000 });
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue,
                    recaptcha_token: recaptchaToken,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);

                toast({ title: "Login successful!", status: "success", duration: 3000 });

                navigate(data.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
            } else {
                if (recaptchaRef.current) recaptchaRef.current.reset();
                setRecaptchaToken("");
                toast({ title: data.message, status: "error", duration: 3000 });
            }
        } catch (error) {
            console.error("Login failed:", error);
            if (recaptchaRef.current) recaptchaRef.current.reset();
            setRecaptchaToken("");
            toast({ title: "Login failed. Please try again.", status: "error", duration: 3000 });
        }
    };

    return (
        <>
            <Button onClick={onOpen} colorScheme="blue">
                Sign in
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign in to Your Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isVerifying ? ( // Render VerificationStatus if verifying
                            <VerificationStatus email={verificationEmail} />
                        ) : (
                            <VStack spacing={4}>
                                {/* Standard Login Form */}
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={emailValue}
                                        onChange={(e) => setEmailValue(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={passwordValue}
                                        onChange={(e) => setPasswordValue(e.target.value)}
                                    />
                                </FormControl>
                                <ReCAPTCHA
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={(token) => setRecaptchaToken(token)}
                                    onExpired={() => {
                                        setRecaptchaToken("");
                                        if (recaptchaRef.current) recaptchaRef.current.reset();
                                        toast({
                                            title: "reCAPTCHA expired. Please try again.",
                                            status: "warning",
                                            duration: 3000,
                                        });
                                    }}
                                    ref={recaptchaRef}
                                />
                                <Button colorScheme="blue" width="full" mt={4} onClick={handleLogin}>
                                    Login
                                </Button>
                                <ForgotPasswordModal />
                                <Divider />
                                <Text fontSize="sm" color="gray.500">
                                    or continue with
                                </Text>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() =>
                                        toast({ title: "Google login failed.", status: "error", duration: 3000 })
                                    }
                                />
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default LoginFormModal;
