import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, Flex, Heading, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
    useBreakpointValue, Text
} from '@chakra-ui/react';
import Pagination from "../components/Pagination"; // Adjust the path for your pagination component

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState(''); // Search term for the search bar
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [name, setName] = useState(''); // Separate state for name input in the modal
    const [email, setEmail] = useState('');
    const [designation, setDesignation] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const studentsPerPage = 8; // Number of students per page
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
    const isSmallScreen = useBreakpointValue({ base: true, md: false }); // Responsive logic

    const apiUrl = 'http://localhost:5000/api/user';

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(apiUrl);
            const studentsData = response.data?.data;
            if (Array.isArray(studentsData)) {
                const filteredStudents = studentsData.filter(student => student.role !== 'admin');
                setStudents(filteredStudents);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            setStudents([]);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setDesignation('');
        setEditing(false);
        setCurrentId(null);
    };

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !designation.trim()) {
            toast({ title: "Please fill all fields", status: "error", duration: 2000, isClosable: true });
            return;
        }

        try {
            const payload = { name, email, designation };
            if (editing) {
                await axios.put(`${apiUrl}/${currentId}`, payload);
                toast({ title: "Student updated successfully", status: "success", duration: 2000, isClosable: true });
            } else {
                const response = await axios.post(apiUrl, payload);
                if (response.data) {
                    setStudents((prevStudents) => [...prevStudents, response.data]);
                }
                toast({ title: "Student added successfully", status: "success", duration: 2000, isClosable: true });
            }
            fetchStudents();
            onClose(); // Close the modal after submission
        } catch (error) {
            console.error("Error saving student:", error);
            toast({ title: "Error saving student", status: "error", duration: 2000, isClosable: true });
        }

        resetForm();
    };

    const handleEdit = (student) => {
        setEditing(true);
        setCurrentId(student._id);
        setName(student.name || ''); // Pre-fill name with student data
        setEmail(student.email || '');
        setDesignation(student.designation || '');
        onOpen(); // Open the modal in edit mode
    };

    const handleArchive = async (id) => {
        try {
            await axios.patch(`${apiUrl}/archive/${id}`);
            toast({ title: "User archived successfully", status: "info", duration: 2000, isClosable: true });
            fetchStudents();
        } catch (error) {
            console.error("Error archiving user:", error);
            toast({ title: "Error archiving user", status: "error", duration: 2000, isClosable: true });
        }
    };

    // Filter students based on the search term and ensure they are not archived
    const filteredStudents = students.filter((student) => {
        const searchLower = search.toLowerCase();
        return (
            (student.name?.toLowerCase().includes(searchLower) || // Optional chaining
                student.email?.toLowerCase().includes(searchLower) ||
                student.designation?.toLowerCase().includes(searchLower)) &&
            !student.archived
        );
    });

    // Pagination logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    return (
        <Box p={4} maxW="container.xl" mx="auto">
            {/* Header: Students Management, Search Bar, and Add Button */}
            <Flex justify="space-between" align="center" mb={6}>
                <Heading fontSize={isSmallScreen ? "xl" : "2xl"}>Students Management</Heading>

                {/* Search Bar and Add Student Button */}
                <Flex gap={4} align="center">
                    <Input
                        placeholder="Search by Name, Email, or Designation"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        width={isSmallScreen ? "200px" : "300px"}
                    />
                    <Button
                        onClick={() => {
                            resetForm(); // Reset form fields before opening modal
                            onOpen();
                        }}
                        colorScheme="teal"
                    >
                        Add Student
                    </Button>
                </Flex>
            </Flex>

            {/* Add/Edit Student Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{editing ? "Edit Student" : "Add Student"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)} // Use `name` state for this input
                            />
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                placeholder="Designation"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleSubmit} width="full">
                            {editing ? "Update Student" : "Add Student"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Students Table */}
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
                        {currentStudents.length > 0 ? (
                            currentStudents.map((student) => (
                                <Tr key={student._id}>
                                    <Td>{student._id}</Td>
                                    <Td>{student.name}</Td>
                                    <Td>{student.email}</Td>
                                    <Td>{student.designation}</Td>
                                    <Td>
                                        <Flex gap={2} wrap="wrap">
                                            <Button colorScheme="yellow" onClick={() => handleEdit(student)} size={isSmallScreen ? "sm" : "md"}>
                                                Edit
                                            </Button>
                                            <Button colorScheme="purple" onClick={() => handleArchive(student._id)} size={isSmallScreen ? "sm" : "md"}>
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

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </Box>
    );
};

export default StudentsPage;
