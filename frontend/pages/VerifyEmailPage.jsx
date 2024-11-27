import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner, Box, Text, useToast } from "@chakra-ui/react";

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const toast = useToast();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");
            if (!token) {
                toast({
                    title: "Verification Failed",
                    description: "Verification token is missing.",
                    status: "error",
                    duration: 3000,
                });
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:5000/api/auth/verify-email?token=${token}`,
                    { method: "GET" }
                );
                const data = await response.json();

                if (response.ok) {
                    // Notify original tab via BroadcastChannel
                    const broadcast = new BroadcastChannel("email-verification");
                    broadcast.postMessage({
                        success: true,
                        user: data.user,
                        token: data.token,
                    });

                    toast({
                        title: "Email Verified",
                        description: "Redirecting to your dashboard...",
                        status: "success",
                        duration: 3000,
                    });

                    // Close the new tab
                    setTimeout(() => {
                        window.close();
                    }, 2000);
                } else {
                    toast({
                        title: "Verification Failed",
                        description: data.message || "Unable to verify email.",
                        status: "error",
                        duration: 3000,
                    });
                }
            } catch (error) {
                console.error("Verification error:", error);
                toast({
                    title: "Verification Error",
                    description: "An error occurred during verification.",
                    status: "error",
                    duration: 3000,
                });
            }
        };

        verifyEmail();
    }, [searchParams, toast]);


    return (
        <Box textAlign="center" mt={10}>
            <Spinner size="xl" />
            <Text>Verifying your email. Please wait...</Text>
        </Box>
    );
}

export default VerifyEmailPage;
