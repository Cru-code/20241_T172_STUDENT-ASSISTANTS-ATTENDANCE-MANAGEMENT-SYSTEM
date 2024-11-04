import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Navbar from "../components/Navbar";
import AdminDashboard from "../pages/AdminDashboard";
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.50", "gray.900")} >
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </GoogleOAuthProvider>
    </Box >
  )
}

export default App
