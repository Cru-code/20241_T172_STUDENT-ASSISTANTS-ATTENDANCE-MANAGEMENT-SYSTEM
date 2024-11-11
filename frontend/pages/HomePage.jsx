import React from 'react';
import { Box, Text, Heading, Button, Center, VStack, Image } from '@chakra-ui/react';
import landingImage from '../images/homepage.jpg'; // Adjust the path to your image file

const HomePage = () => {
    return (

        <Box
            minH="93vh"
            bgImage={`url(${landingImage})`}
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            px={8}
            py={16}
        >
            <VStack
                spacing={6}
                maxW="600px"
                textAlign="center"
                bg="rgba(0, 0, 0, 0.6)"
                p={8}
                borderRadius="md"
                backdropFilter="blur(0.5px)"
            >
                <Heading as="h1" size="2xl">
                    Welcome to SAAMS
                </Heading>
                <Text fontSize="lg">
                    Empowering <strong>Students</strong>, <strong>Administrators</strong>, and <strong>Community Members</strong> with a Seamless Experience!
                </Text>
                <Text fontSize="md">
                    Discover the convenience and simplicity SAAMS brings to your fingertips!
                </Text>
                <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={() => {
                        // handle navigation or action
                    }}
                >
                    Get Started
                </Button>
            </VStack>
        </Box>
    );
};

export default HomePage;
