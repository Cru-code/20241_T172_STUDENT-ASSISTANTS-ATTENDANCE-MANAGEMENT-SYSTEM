import { Button, Container, Flex, HStack, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import LoginFormModal from './LoginFormModal';

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (

        <Container maxW={"1800px"} px={4} >
            <Flex
                h={16}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{
                    base: "column",
                    sm: "row"
                }}
            >
                <Text
                    fontSize={{ base: "22", sm: "28" }}
                    fontWeight={"bold"}
                    textTransform={"uppercase"}
                    textAlign={"center"}
                    bgGradient={"linear(to-r, cyan.400, blue.500)"}
                    bgClip={"text"}
                >
                    <Link to={"/"}>Student Assistant Attendance Hub</Link>
                </Text>

                <HStack spacing={2} alignItems={"center"}>

                    <LoginFormModal />
                    <Button onClick={toggleColorMode}>{colorMode === "light" ? <LuSun size="20" /> :
                        <IoMoon size="20" />}
                    </Button>


                </HStack>
            </Flex>
        </Container>
    );
};
export default Navbar;