import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Flex, Heading, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [designation, setDesignation] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const toast = useToast();

    const apiUrl = 'http://localhost:5000/api/users'; // Replace with your actual API endpoint

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(apiUrl);
            console.log("Fetched data:", response.data);

            const studentsData = response.data?.data;
            if (Array.isArray(studentsData)) {
                // Filter out admin users
                const filteredStudents = studentsData.filter(student => student.role !== 'admin');
                setStudents(filteredStudents);
            } else {
                console.error("Unexpected response format. Data is not an array:", studentsData);
                setStudents([]); // Reset to an empty array if the data is invalid
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setStudents([]); // Reset to an empty array on error
        }
    };





    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !designation.trim()) {
            toast({ title: "Please fill all fields", status: "error", duration: 2000, isClosable: true });
            return;
        }

        try {
            const payload = { name, email, designation };
            console.log("Submitting payload:", payload); // Debug log

            if (editing) {
                await axios.put(`${apiUrl}/${currentId}`, payload);
                toast({ title: "Student updated successfully", status: "success", duration: 2000, isClosable: true });
            } else {
                const response = await axios.post(apiUrl, payload);
                setStudents([...students, response.data]);
                toast({ title: "Student added successfully", status: "success", duration: 2000, isClosable: true });
            }
            fetchStudents();
        } catch (error) {
            console.error("Error saving student:", error);
            toast({ title: "Error saving student", status: "error", duration: 2000, isClosable: true });
        }

        setName('');
        setEmail('');
        setDesignation('');
        setEditing(false);
        setCurrentId(null);
    };

    const handleEdit = (student) => {
        setEditing(true);
        setCurrentId(student._id);
        setName(student.name);
        setEmail(student.email);
        setDesignation(student.designation || '');
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
            toast({ title: "User archived successfully", status: "info", duration: 2000, isClosable: true });

            // Refresh the list after archiving
            fetchStudents();
        } catch (error) {
            console.error("Error archiving user:", error);
            toast({ title: "Error archiving user", status: "error", duration: 2000, isClosable: true });
        }
    };


    return (
        <Box p={8}>
            <Heading mb={6}>Students Management</Heading>

            {/* Add/Edit Form */}
            <VStack spacing={4} mb={8}>
                <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
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
                        <Th>Designation</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {students.length > 0 ? (
                        students
                            .filter((student) => !student.archived) // Only show unarchived users
                            .map((student) => (
                                <Tr key={student._id}>
                                    <Td>{student._id}</Td>
                                    <Td>{student.name}</Td>
                                    <Td>{student.email}</Td>
                                    <Td>{student.designation}</Td>
                                    <Td>
                                        <Flex gap={2}>
                                            <Button colorScheme="yellow" onClick={() => handleEdit(student)}>Edit</Button>
                                            <Button colorScheme="red" onClick={() => handleDelete(student._id)}>Delete</Button>
                                            <Button colorScheme="purple" onClick={() => handleArchive(student._id)}>
                                                Archive
                                            </Button>
                                        </Flex>
                                    </Td>
                                </Tr>
                            ))
                    ) : (
                        <Tr>
                            <Td colSpan={5} textAlign="center">
                                No students found.
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </Box>
    );
};

export default StudentsPage;
