import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tbody, Td, Th, Thead, Tr, Box, Heading } from '@chakra-ui/react';

const ArchivesPage = () => {
    const [archivedStudents, setArchivedStudents] = useState([]);
    const apiUrl = 'http://localhost:5000/api/users'; // Backend API

    useEffect(() => {
        const fetchArchivedStudents = async () => {
            try {
                const response = await axios.get(apiUrl);
                setArchivedStudents(response.data.data.filter(student => student.archived));
            } catch (error) {
                console.error("Error fetching archived students:", error.message);
            }
        };

        fetchArchivedStudents();
    }, []);

    return (
        <Box>
            <Heading mb={6}>Archived Students</Heading>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {archivedStudents.map(student => (
                        <Tr key={student._id}>
                            <Td>{student._id}</Td>
                            <Td>{student.name}</Td>
                            <Td>{student.email}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default ArchivesPage;
