import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tbody, Td, Th, Thead, Tr, Box, Heading, Button, useToast, Flex, useBreakpointValue, Text } from '@chakra-ui/react';

const ArchivedUsersPage = () => {
    const apiUrl = 'http://localhost:5000/api/user'; // Replace with the correct API URL
    const [archivedUsers, setArchivedUsers] = useState([]);
    const toast = useToast();
    const isSmallScreen = useBreakpointValue({ base: true, md: false }); // For responsiveness

    useEffect(() => {
        fetchArchivedUsers();
    }, []);

    const fetchArchivedUsers = async () => {
        try {
            const response = await axios.get(apiUrl);
            if (response.data && response.data.data) {
                setArchivedUsers(response.data.data.filter(user => user.archived));
            } else {
                console.error("Invalid response format:", response);
            }
        } catch (error) {
            console.error("Error fetching archived users:", error.toJSON ? error.toJSON() : error);
            toast({
                title: "Failed to fetch archived users.",
                description: error.message || "Network error. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleUnarchive = async (id) => {
        try {
            await axios.patch(`${apiUrl}/unarchive/${id}`);
            toast({ title: "User unarchived successfully", status: "info", duration: 2000, isClosable: true });
            fetchArchivedUsers(); // Refresh the list
        } catch (error) {
            console.error("Error unarchiving user:", error);
            toast({ title: "Error unarchiving user", status: "error", duration: 2000, isClosable: true });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/${id}`);
            setArchivedUsers(archivedUsers.filter(user => user._id !== id)); // Remove user from local state
            toast({ title: "User deleted", status: "info", duration: 2000, isClosable: true });
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({ title: "Error deleting user", status: "error", duration: 2000, isClosable: true });
        }
    };

    return (
        <Box p={4} maxW="container.xl" mx="auto">
            <Heading mb={6} textAlign={isSmallScreen ? "center" : "left"} fontSize={isSmallScreen ? "lg" : "2xl"}>
                Archived Users
            </Heading>

            {/* Responsive Table Container */}
            <Box overflowX="auto">
                <Table variant="simple" size={isSmallScreen ? "sm" : "md"}>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Designation</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {archivedUsers.length > 0 ? (
                            archivedUsers.map((user) => (
                                <Tr key={user._id}>
                                    <Td>{user._id}</Td>
                                    <Td>{user.name}</Td>
                                    <Td>{user.email}</Td>
                                    <Td>{user.designation}</Td>
                                    <Td>
                                        <Flex gap={2} wrap={isSmallScreen ? "wrap" : "nowrap"}>
                                            <Button
                                                colorScheme="green"
                                                size={isSmallScreen ? "sm" : "md"}
                                                onClick={() => handleUnarchive(user._id)}
                                            >
                                                Unarchive
                                            </Button>
                                            <Button
                                                colorScheme="red"
                                                size={isSmallScreen ? "sm" : "md"}
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </Button>
                                        </Flex>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={5} textAlign="center">
                                    <Text fontSize={isSmallScreen ? "sm" : "md"}>No archived users found.</Text>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default ArchivedUsersPage;
