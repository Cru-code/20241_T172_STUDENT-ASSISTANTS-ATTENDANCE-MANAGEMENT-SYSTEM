import React, { useEffect } from 'react';
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "../components/Navbar";
import StudentsPage from "../pages/StudentsPage";
import ArchivedUsersPage from "../pages/ArchivesPage";
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import AttendancePage from "../pages/AttendancePage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import VerificationStatus from "../components/VerificationStatus";

const App = () => {
  const location = useLocation();
  const bg = useColorModeValue("gray.50", "gray.900");

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user !== null;
  };

  return (
    <Box minH="100vh" bg={bg}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        {/* Render Navbar only on the home page */}
        {location.pathname === "/" && <Navbar />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordModal />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-status" element={<VerificationStatus />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/students"
            element={isAuthenticated() ? <StudentsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/archived"
            element={isAuthenticated() ? <ArchivedUsersPage /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/attendance"
            element={isAuthenticated() ? <AttendancePage /> : <Navigate to="/" />}
          />

          {/* Protected User Routes */}
          <Route
            path="/user/dashboard"
            element={isAuthenticated() ? <UserDashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </GoogleOAuthProvider>
    </Box>
  );
};

export default App;
