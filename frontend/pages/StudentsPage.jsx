import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, Flex, Heading, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
    AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
    useBreakpointValue, Text
} from '@chakra-ui/react';
import Pagination from "../components/Pagination"; // Adjust the path for your pagination component

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [view, setView] = useState('active'); // View state: 'active' or 'archived'
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [designation, setDesignation] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const cancelRef = React.useRef();
    const studentsPerPage = 8;
    const toast = useToast();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    const apiUrl = 'http://localhost:5000/api/user';

    useEffect(() => {
        fetchStudents();
    }, [view]); // Refetch when view changes

    const fetchStudents = async () => {
        try {
            const response = await axios.get(apiUrl);
            const studentsData = response.data?.data || [];
            setStudents(studentsData);
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
                await axios.post(apiUrl, payload);
                toast({ title: "Student added successfully", status: "success", duration: 2000, isClosable: true });
            }
            fetchStudents();
            onClose();
        } catch (error) {
            console.error("Error saving student:", error);
            toast({ title: "Error saving student", status: "error", duration: 2000, isClosable: true });
        }

        resetForm();
    };

    const handleEdit = (student) => {
        setEditing(true);
        setCurrentId(student._id);
        setName(student.name || '');
        setEmail(student.email || '');
        setDesignation(student.designation || '');
        onOpen();
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await axios.delete(`${apiUrl}/${deleteId}`);
            setStudents((prev) => prev.filter((student) => student._id !== deleteId));
            toast({ title: "Student deleted successfully", status: "success", duration: 2000, isClosable: true });
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({ title: "Error deleting user", status: "error", duration: 2000, isClosable: true });
        } finally {
            setDeleteId(null);
            onAlertClose();
        }
    };

    const handleArchiveToggle = async (id, archived) => {
        try {
            const endpoint = archived ? `${apiUrl}/unarchive/${id}` : `${apiUrl}/archive/${id}`;
            await axios.patch(endpoint);
            toast({
                title: `User ${archived ? 'unarchived' : 'archived'} successfully`,
                status: "info",
                duration: 2000,
                isClosable: true,
            });
            fetchStudents();
        } catch (error) {
            console.error("Error toggling archive status:", error);
            toast({ title: "Error toggling archive status", status: "error", duration: 2000, isClosable: true });
        }
    };

    const filteredStudents = students.filter((student) => {
        const searchLower = search.toLowerCase();
        const matchesSearch = student.name?.toLowerCase().includes(searchLower)
            || student.email?.toLowerCase().includes(searchLower)
            || student.designation?.toLowerCase().includes(searchLower);
        return view === 'active'
            ? matchesSearch && !student.archived
            : matchesSearch && student.archived;
    });

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    useEffect(() => {
        if (search.trim()) setCurrentPage(1); // Reset to first page when searching
    }, [search]);

    const handleViewChange = () => {
        setView(view === 'active' ? 'archived' : 'active');
        setCurrentPage(1); // Reset page to 1 when switching views
    };

    return (
        <Box p={4} maxW="container.xl" mx="auto">
            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Heading fontSize={isSmallScreen ? "xl" : "2xl"}>
                    {view === 'active' ? "Students Management" : "Archived Users"}
                </Heading>
                <Flex gap={4} align="center">
                    <Input
                        placeholder="Search by Name, Email, or Designation"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        width={isSmallScreen ? "200px" : "300px"}
                    />
                    {view === 'active' && (
                        <Button
                            onClick={() => {
                                resetForm();
                                onOpen();
                            }}
                            colorScheme="teal"
                        >
                            Add Student
                        </Button>
                    )}
                    <Button onClick={handleViewChange} colorScheme="purple">
                        {view === 'active' ? "View Archived" : "View Active"}
                    </Button>
                </Flex>
            </Flex>

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
                                        <Flex gap={4}>
                                            {view === 'active' && (
                                                <>
                                                    <Button
                                                        colorScheme="yellow"
                                                        onClick={() => handleEdit(student)}
                                                        size={isSmallScreen ? "sm" : "md"}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        colorScheme="purple"
                                                        onClick={() => handleArchiveToggle(student._id, false)}
                                                        size={isSmallScreen ? "sm" : "md"}
                                                    >
                                                        Archive
                                                    </Button>
                                                </>
                                            )}
                                            {view === 'archived' && (
                                                <>
                                                    <Button
                                                        colorScheme="green"
                                                        onClick={() => handleArchiveToggle(student._id, true)}
                                                        size={isSmallScreen ? "sm" : "md"}
                                                    >
                                                        Unarchive
                                                    </Button>
                                                    <Button
                                                        colorScheme="red"
                                                        onClick={() => {
                                                            setDeleteId(student._id);
                                                            onAlertOpen();
                                                        }}
                                                        size={isSmallScreen ? "sm" : "md"}
                                                    >
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </Flex>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={5} textAlign="center">
                                    No {view === 'active' ? 'students' : 'archived users'} found.
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

            {/* Add/Edit Modal */}
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
                                onChange={(e) => setName(e.target.value)}
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

            {/* AlertDialog for Delete Confirmation */}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete User
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onAlertClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default StudentsPage;
