import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import {
    Box,
    Avatar,
    Text,
    VStack,
    Flex,
    HStack,
    Button,
    useColorMode,
    useColorModeValue,
    Heading,
    Container
} from '@chakra-ui/react';
import StudentsPage from './StudentsPage'; // Import StudentsPage component
import ArchivesPage from './ArchivesPage';
import AttendancePage from './AttendancePage';

const AdminDashboard = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const [selectedContent, setSelectedContent] = useState('welcome'); // State for selected content
    const [userData, setUserData] = useState(null); // Store user data (name, email, image)

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserData(storedUser);
        }
    }, []);

    const handleLogout = () => {
        console.log("User logged out");
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    // Function to render the main content based on selected link
    const renderContent = () => {
        switch (selectedContent) {
            case 'students':
                return <StudentsPage />;
            case 'attendance':
                return <AttendancePage />;
            default:
                return (
                    <>
                        <Heading mb={6}>Welcome, Admin</Heading>
                        <Text>Here you can manage students, attendance, and archives.</Text>
                    </>
                );
        }
    };

    return (
        <Container maxW="1800px" px={4}>
            {/* Top Navigation Bar */}
            <Flex
                h={16}
                alignItems="center"
                justifyContent="space-between"
                flexDir={{
                    base: "column",
                    sm: "row"
                }}
            >
                <Text
                    fontSize={{ base: "22", sm: "28" }}
                    fontWeight="bold"
                    textTransform="uppercase"
                    textAlign="center"
                    bgGradient="linear(to-r, cyan.400, blue.500)"
                    bgClip="text"
                >
                    Admin Dashboard
                </Text>

                <HStack spacing={2} alignItems="center">
                    <Button onClick={handleLogout}>Logout</Button>
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <LuSun size="20" /> : <IoMoon size="20" />}
                    </Button>
                </HStack>
            </Flex>

            <Flex>
                {/* Sidebar */}
                <Box
                    w="250px"
                    p={5}
                    bg={useColorModeValue('gray.100', 'gray.800')}
                    borderRadius="md"
                    boxShadow="lg"
                    mr={4}
                >
                    {/* Admin Profile Section */}
                    {userData && (
                        <VStack spacing={4} mb={10} align="center">
                            <Avatar name={userData.name} src={userData.image} size="xl" mx="auto" />
                            <Text fontSize="lg" fontWeight="bold">{userData.name}</Text>
                            <Text fontSize="sm" color="blue.200">{userData.email}</Text>
                        </VStack>
                    )}

                    {/* Sidebar Links */}
                    <VStack spacing={4} align="start" w="full">
                        <Button
                            variant="ghost"
                            w="full"
                            justifyContent="start"
                            onClick={() => setSelectedContent('welcome')}
                        >
                            Dashboard
                        </Button>
                        <Button
                            variant="ghost"
                            w="full"
                            justifyContent="start"
                            onClick={() => setSelectedContent('students')}
                        >
                            Students
                        </Button>
                        <Button
                            variant="ghost"
                            w="full"
                            justifyContent="start"
                            onClick={() => setSelectedContent('attendance')}
                        >
                            Attendance
                        </Button>

                    </VStack>
                </Box>

                {/* Main Content Area */}
                <Box
                    flex="1"
                    p={8}
                    bg={useColorModeValue('gray.50', 'gray.900')}
                    borderRadius="md"
                    boxShadow="lg"
                >
                    {renderContent()}
                </Box>
            </Flex>
        </Container>
    );
};

export default AdminDashboard;
