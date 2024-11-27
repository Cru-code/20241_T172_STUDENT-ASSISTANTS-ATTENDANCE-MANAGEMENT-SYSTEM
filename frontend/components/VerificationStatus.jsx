import React, { useEffect, useState } from "react";
import { Spinner, Box, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function VerificationStatus({ email }) {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const broadcastChannel = new BroadcastChannel("email-verification");

        const handleMessage = (message) => {
            if (message.data?.success) {
                setIsVerified(true);
                setLoading(false);

                // Save token and user data
                localStorage.setItem("user", JSON.stringify(message.data.user));
                localStorage.setItem("token", message.data.token);

                toast({
                    title: "Email Verified",
                    description: "A random password has been sent to your email. Redirecting to your dashboard...",
                    status: "success",
                    duration: 5000,
                });

                setTimeout(() => {
                    navigate("/user/dashboard");
                }, 3000);
            }
        };

        broadcastChannel.onmessage = handleMessage;

        return () => {
            broadcastChannel.close();
        };
    }, [toast, navigate]);

    if (loading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
                <Text>Waiting for email verification. Please check your email.</Text>
            </Box>
        );
    }

    if (isVerified) {
        return (
            <Box textAlign="center" mt={10}>
                <Text fontSize="xl" fontWeight="bold">
                    Email Verified Successfully!
                </Text>
                <Text>A random password has been sent to your email.</Text>
            </Box>
        );
    }

    return null;
}

export default VerificationStatus;
