import { HStack, Button, Text } from "@chakra-ui/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const handlePageClick = (page) => {
        onPageChange(page);
    };

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <HStack justifyContent="center" mt={4} spacing={2}>
            <Button onClick={handlePrevious} disabled={currentPage === 1}>
                Previous
            </Button>
            {generatePageNumbers().map((page) => (
                <Button
                    key={page}
                    colorScheme={page === currentPage ? "blue" : "gray"}
                    onClick={() => handlePageClick(page)}
                >
                    {page}
                </Button>
            ))}
            <Button onClick={handleNext} disabled={currentPage === totalPages}>
                Next
            </Button>
        </HStack>
    );
};

export default Pagination;
