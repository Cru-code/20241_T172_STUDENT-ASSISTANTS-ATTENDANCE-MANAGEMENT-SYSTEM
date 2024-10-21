const express = require('express')
const app = express()

// Landing Page
app.get('/', (req, res) => {
    res.send('Landing Page')
})

// Biometric Registration
app.get('/biometric', (req, res) => {
    res.send('Biometric Registration')
})

// Student Assistants & admin login
app.get('/authentication', (req, res) => {
    res.send('Student Assistants & admin login')
})

// Display Attendance Record
app.get('/attendance', (req, res) => {
    res.send('Display Attendance Record')
})

// Download Attendance Record
app.get('/download', (req, res) => {
    res.send('Download Attendance Record')
})

// Add Student
app.post('/students', (req, res) => {
    res.send('Add Student')
})

// Get all Student
app.get('/students/all', (req, res) => {
    res.send('Get all Student')
})

// Get Student by institutional email
app.get('/students/email', (req, res) => {
    res.send('Get Student by institutional email')
})

// Get Student by institutional name
app.get('/students/name', (req, res) => {
    res.send('Get Student by institutional name')
})

// Update Student Information
app.patch('/students/email', (req, res) => {
    res.send('Update Student Information')
})

// Archive Student
app.patch('/students/email/archive', (req, res) => {
    res.send('Archive Student')
})

// Generate Reports
app.get('/report/generate', (req, res) => {
    res.send('Generate Reports')
})

app.listen(3000)