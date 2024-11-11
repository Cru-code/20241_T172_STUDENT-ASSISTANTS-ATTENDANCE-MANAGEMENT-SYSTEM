import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Flex, Heading, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const toast = useToast();

    const apiUrl = 'http://localhost:5000/api/users'; // Adjust this URL based on your backend

    // Fetch all students from the backend
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(apiUrl);
            console.log("Fetched data:", response.data); // Logging the entire response
            if (Array.isArray(response.data.data)) {
                setStudents(response.data.data); // Accessing the data array inside the response
            } else {
                console.error("Expected array but got:", response.data.data);
                setStudents([]);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            toast({ title: "Failed to load students", status: "error", duration: 2000, isClosable: true });
        }
    };


    const handleSubmit = async () => {
        if (name.trim() === "" || email.trim() === "") {
            toast({ title: "Please fill all fields", status: "error", duration: 2000, isClosable: true });
            return;
        }

        try {
            const payload = { name, email };
            console.log("Sending payload:", payload); // Log payload to verify

            if (editing) {
                await axios.put(`${apiUrl}/${currentId}`, payload);
                toast({ title: "Student updated successfully", status: "success", duration: 2000, isClosable: true });
            } else {
                const response = await axios.post(apiUrl, payload); // Make sure payload matches the server's expectations
                setStudents([...students, response.data.data]);
                toast({ title: "Student added successfully", status: "success", duration: 2000, isClosable: true });
            }
            fetchStudents();
        } catch (error) {
            console.error("Error saving student:", error);
            toast({ title: "Error saving student", status: "error", duration: 2000, isClosable: true });
        }

        setName('');
        setEmail('');
        setEditing(false);
        setCurrentId(null);
    };


    const handleEdit = (student) => {
        setEditing(true);
        setCurrentId(student._id);
        setName(student.name);
        setEmail(student.email);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/${id}`);
            setStudents(students.filter(student => student._id !== id));
            toast({ title: "Student deleted", status: "info", duration: 2000, isClosable: true });
        } catch (error) {
            console.error("Error deleting student:", error);
            toast({ title: "Error deleting student", status: "error", duration: 2000, isClosable: true });
        }
    };

    const handleArchive = async (id) => {
        try {
            await axios.patch(`${apiUrl}/archive/${id}`);
            fetchStudents(); // Refresh the list
            toast({ title: "Student archived successfully", status: "info", duration: 2000, isClosable: true });
        } catch (error) {
            console.error("Error archiving student:", error.message);
            toast({ title: "Error archiving student", status: "error", duration: 2000, isClosable: true });
        }
    };

    return (
        <Box p={8}>
            <Heading mb={6}>Students Management</Heading>

            {/* Add/Edit Student Form */}
            <VStack spacing={4} mb={8}>
                <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSubmit} colorScheme="teal" width="full">
                    {editing ? "Update Student" : "Add Student"}
                </Button>
            </VStack>

            {/* Students Table */}
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Array.isArray(students) && students.map((student) => (
                        <Tr key={student._id}>
                            <Td>{student._id}</Td>
                            <Td>{student.name}</Td>
                            <Td>{student.email}</Td>
                            <Td>
                                <Flex gap={2}>
                                    <Button colorScheme="yellow" onClick={() => handleEdit(student)}>Edit</Button>
                                    <Button colorScheme="red" onClick={() => handleDelete(student._id)}>Delete</Button>
                                    <Button colorScheme="purple" onClick={() => handleArchive(student._id)}>
                                        {student.archived ? "Unarchive" : "Archive"}
                                    </Button>;
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default StudentsPage;
