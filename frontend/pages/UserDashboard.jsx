import React from 'react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from "@chakra-ui/react";

const UserDashboard = () => {
    return (
        <div>
            <h2>User Dashboard</h2>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Header 1</Th>
                        <Th>Header 2</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Row 1, Cell 1</Td>
                        <Td>Row 1, Cell 2</Td>
                    </Tr>
                    <Tr>
                        <Td>Row 2, Cell 1</Td>
                        <Td>Row 2, Cell 2</Td>
                    </Tr>
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th>Footer 1</Th>
                        <Th>Footer 2</Th>
                    </Tr>
                </Tfoot>
            </Table>
        </div>
    );
};

export default UserDashboard;
