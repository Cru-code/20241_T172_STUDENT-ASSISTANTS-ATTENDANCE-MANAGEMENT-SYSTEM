import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "../components/Navbar";
import StudentsPage from "../pages/StudentsPage";
import ArchivedUsersPage from "../pages/ArchivesPage";

function App() {
  const location = useLocation();
  const bg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box minH="100vh" bg={bg}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {/* Render Navbar only on the /home path */}
        {location.pathname === "/" && <Navbar />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/archived" element={<ArchivedUsersPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </Box>
  );
}

export default App;
