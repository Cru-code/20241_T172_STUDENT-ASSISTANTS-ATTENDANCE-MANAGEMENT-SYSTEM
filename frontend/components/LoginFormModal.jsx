import React from 'react';
import { Button } from '@chakra-ui/react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function LoginFormModal() {
    const navigate = useNavigate();

    const handleGoogleSuccess = async (response) => {
        const token = response.credential;

        try {
            const res = await fetch('http://localhost:5000/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            });
            const data = await res.json();

            // Redirect based on user role
            if (data.user.role === 1) {
                navigate('/admin');
            } else {
                navigate('/user');
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

        <Button>
            <GoogleLogin
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                buttonText="Sign in with Google"
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                cookiePolicy={"single_host_origin"}
                theme="outline"
                shape="rectangular"
            />
        </Button>

        </>
    );
}

export default LoginFormModal;
