import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useColorModeValue,
    Container,
    Flex,
    HStack,
    Text,
    useColorMode,
    VStack,
    Avatar,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

const UserDashboard = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [attendanceLog, setAttendanceLog] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        // Check if redirected after email verification
        if (location.state?.passwordSent) {
            setShowAlert(true);
        }
    }, [location.state]);

    useEffect(() => {
        // Load user data from localStorage
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            } else {
                // Redirect to login if no user data is found
                navigate('/');
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        // Simulate API call to fetch attendance log
        const fetchAttendanceLog = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/attendance');
                if (response.ok) {
                    const data = await response.json();
                    setAttendanceLog(data);
                } else {
                    console.error("Failed to fetch attendance log.");
                }
            } catch (error) {
                console.error("Error fetching attendance log:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendanceLog();
    }, []);

    const handleLogout = () => {
        localStorage.clear(); // Clear user data
        console.log("User logged out");
        navigate('/');
    };

    const downloadCSV = () => {
        const headers = ['Date', 'Time In (AM)', 'Time Out (AM)', 'Time In (PM)', 'Time Out (PM)'];
        const rows = attendanceLog.map((log) => [
            log.date,
            log.amTimeIn || 'N/A',
            log.amTimeOut || 'N/A',
            log.pmTimeIn || 'N/A',
            log.pmTimeOut || 'N/A',
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'attendance_log.csv';
        link.click();
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

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
                    Student Assistant Attendance Hub
                </Text>

                <HStack spacing={2} alignItems="center">
                    <Button onClick={handleLogout}>Logout</Button>
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <LuSun size="20" /> : <IoMoon size="20" />}
                    </Button>
                </HStack>
            </Flex>

            {/* Password Sent Alert */}
            {showAlert && (
                <Alert
                    status="info"
                    mb={6}
                    borderRadius="md"
                    boxShadow="md"
                    transition="transform 0.3s ease-in-out"
                    _hover={{ transform: 'scale(1.02)' }} // Subtle hover effect
                >
                    <AlertIcon />
                    <Box flex="1">
                        <AlertTitle fontSize="lg">Password Sent!</AlertTitle>
                        <AlertDescription fontSize="md">
                            A randomly generated password has been sent to your email. Please use it to log in and consider changing your password for security.
                        </AlertDescription>
                    </Box>
                    <CloseButton
                        alignSelf="flex-start"
                        position="relative"
                        right={-1}
                        top={-1}
                        onClick={() => setShowAlert(false)} // Close alert
                    />
                </Alert>
            )}

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
                    {/* User Profile Section */}
                    <VStack spacing={4} mb={10} align="center">
                        <Avatar
                            name={user?.name}
                            src={user?.image}
                            size="xl"
                            mx="auto"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/150'} // Fallback image
                        />
                        <Text fontSize="lg" fontWeight="bold">{user?.name || 'Guest User'}</Text>
                        <Text fontSize="sm" color="blue.200">{user?.email || 'No Email Available'}</Text>
                    </VStack>

                    {/* Sidebar Links */}
                    <VStack spacing={4} align="start" w="full">
                        <Button as={Link} to="/user/dashboard" variant="ghost" w="full" justifyContent="start">
                            Dashboard
                        </Button>
                        <Button as={Link} to="/user/attendance" variant="ghost" w="full" justifyContent="start">
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
                    <Heading mb={6}>User Attendance Log</Heading>

                    <Table variant="striped" colorScheme="teal" size="md">
                        <Thead>
                            <Tr>
                                <Th>Date</Th>
                                <Th>Time In (AM)</Th>
                                <Th>Time Out (AM)</Th>
                                <Th>Time In (PM)</Th>
                                <Th>Time Out (PM)</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {attendanceLog.map((log, index) => (
                                <Tr key={index}>
                                    <Td>{log.date}</Td>
                                    <Td>{log.amTimeIn || 'N/A'}</Td>
                                    <Td>{log.amTimeOut || 'N/A'}</Td>
                                    <Td>{log.pmTimeIn || 'N/A'}</Td>
                                    <Td>{log.pmTimeOut || 'N/A'}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>

                    <Button
                        leftIcon={<DownloadIcon />}
                        colorScheme="teal"
                        mt={4}
                        onClick={downloadCSV}
                    >
                        Download Attendance Log
                    </Button>
                </Box>
            </Flex>
        </Container>
    );
};

export default UserDashboard;
