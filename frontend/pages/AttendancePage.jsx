import React, { useState } from "react";
import {
    Box,
    Button,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast,
    VStack,
    Heading,
    Flex,
    Text,
} from "@chakra-ui/react";

const AttendancePage = () => {
    const [students, setStudents] = useState([
        { id: 1, name: "John Doe", status: "Absent" },
        { id: 2, name: "Jane Smith", status: "Absent" },
        { id: 3, name: "Alice Brown", status: "Absent" },
    ]); // Sample data
    const toast = useToast();

    const markAttendance = (id, status) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.id === id ? { ...student, status } : student
            )
        );
        toast({
            title: "Attendance Updated",
            description: `Student marked as ${status}`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box p={4} maxW="container.xl" mx="auto">
            <Heading mb={4}>Attendance Management</Heading>
            <Table variant="simple" size="md">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {students.map((student) => (
                        <Tr key={student.id}>
                            <Td>{student.id}</Td>
                            <Td>{student.name}</Td>
                            <Td>{student.status}</Td>
                            <Td>
                                <Flex gap={2}>
                                    <Button
                                        colorScheme="green"
                                        onClick={() => markAttendance(student.id, "Present")}
                                    >
                                        Present
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={() => markAttendance(student.id, "Absent")}
                                    >
                                        Absent
                                    </Button>
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default AttendancePage;
