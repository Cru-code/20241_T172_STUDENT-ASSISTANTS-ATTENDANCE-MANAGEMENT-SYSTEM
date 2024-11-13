import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    Avatar
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

const UserDashboard = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const [attendanceLog, setAttendanceLog] = useState([]);

    useEffect(() => {
        // Fetch attendance data from the backend
        const fetchAttendance = async () => {
            try {
                const response = await fetch('/api/attendance');
                const data = await response.json();
                setAttendanceLog(data);
            } catch (error) {
                console.error('Error fetching attendance log:', error);
            }
        };

        fetchAttendance();
    }, []);

    const handleLogout = () => {
        console.log("User logged out");
        navigate('/');
    };

    const downloadCSV = () => {
        const headers = ['Date', 'Time In', 'Time Out'];
        const rows = attendanceLog.map((log) => [log.Day, log.TimeIn, log.timeOut]);
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
                    <Link to="/">Student Assistant Attendance Hub</Link>
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
                    {/* User Profile Section */}
                    <VStack spacing={4} mb={10} align="center">
                        <Avatar name="User" size="xl" mx="auto" />
                        <Text fontSize="lg" fontWeight="bold">User Name</Text>
                        <Text fontSize="sm" color="blue.200">User Role</Text>
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
                                <Th>Day</Th>
                                <Th>
                                    <Box textAlign="center">
                                        <Text fontSize="12px" fontWeight="bold">AM</Text>
                                        <Box display="flex" justifyContent="space-between" mt="1">
                                            <Text>Time In</Text>
                                            <Text>Time Out</Text>
                                        </Box>
                                    </Box>
                                </Th>
                                <Th>
                                    <Box textAlign="center">
                                        <Text fontSize="12px" fontWeight="bold">PM</Text>
                                        <Box display="flex" justifyContent="space-between" mt="1">
                                            <Text>Time In</Text>
                                            <Text>Time Out</Text>
                                        </Box>
                                    </Box>
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {attendanceLog.map((log, index) => (
                                <Tr key={index}>
                                    <Td>{log.date}</Td>
                                    <Td>{log.timeIn}</Td>
                                    <Td>{log.timeOut}</Td>
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
