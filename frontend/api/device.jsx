import axios from 'axios';

const API_URL = 'http://localhost:5000/api/device'; // Adjust to your backend URL

export const connectToDevice = async (ip, port) => {
  try {
    const response = await axios.post(`${API_URL}/connect`, { IPAddress: ip, Port: port });
    return response.data;
  } catch (error) {
    console.error('Error connecting to the device:', error);
    throw error;
  }
};

export const getAttendanceLogs = async (machineNumber) => {
  try {
    const response = await axios.get(`${API_URL}/attendance`, { params: { machineNumber } });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    throw error;
  }
};
