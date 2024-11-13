import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tbody, Td, Th, Thead, Tr, Box, Heading, Button, useToast } from '@chakra-ui/react';

const ArchivedUsersPage = () => {
    const apiUrl = 'http://localhost:5000/api/users'; // Replace with the correct API URL
    const [archivedUsers, setArchivedUsers] = useState([]);
    const toast = useToast();

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

            // Refresh archived users list
            fetchArchivedUsers();
        } catch (error) {
            console.error("Error unarchiving user:", error);
            toast({ title: "Error unarchiving user", status: "error", duration: 2000, isClosable: true });
        }
    };



    return (
        <Box p={8}>
            <Heading mb={6}>Archived Users</Heading>
            <Table variant="simple">
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
                                    <Button colorScheme="green" onClick={() => handleUnarchive(user._id)}>
                                        Unarchive
                                    </Button>
                                </Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={5} textAlign="center">
                                No archived users found.
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </Box>
    );
};

export default ArchivedUsersPage;
