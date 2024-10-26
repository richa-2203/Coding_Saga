const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); // File system module for JSON handling
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Handle JSON data

// Load users from JSON file
const loadUsers = () => {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users.json:', error);
        return []; // Return an empty array if the file read fails
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Load users from the JSON file
    const users = loadUsers();
    
    // Find user with matching email and password
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        switch (user.role) {
            case 'student':
                return res.redirect('/student');
            case 'security':
                return res.redirect('/security');
            case 'admin':
                return res.redirect('/admin');
            default:
                return res.redirect('/');
        }
    } else {
        res.redirect('/?error=invalid');
    }
});

// Route for each role page
app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

app.get('/security', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'security.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API to create a leave request and save to JSON file
app.post('/api/leave-requests', (req, res) => {
    const { name, branch, rollNumber, phoneNumber, email, dateOfLeave, dateOfReturn } = req.body;

    const newLeaveRequest = {
        name,
        branch,
        rollNumber,
        phoneNumber,
        email,
        dateOfLeave,
        dateOfReturn,
        createdAt: new Date(), // Timestamp the request creation
        status: 'Pending' // Default status
    };

    // Load existing requests, add new request, and save back to JSON file
    const requests = loadLeaveRequests();
    requests.push(newLeaveRequest);
    saveLeaveRequests(requests);

    res.status(201).json({ message: 'Leave request submitted successfully.', leaveRequest: newLeaveRequest });
});

// Helper functions to load and save leave requests
const loadLeaveRequests = () => {
    try {
        const data = fs.readFileSync('leaveRequests.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading leaveRequests.json:', error);
        return []; // Return empty array if file read fails
    }
};

const saveLeaveRequests = (requests) => {
    try {
        fs.writeFileSync('leaveRequests.json', JSON.stringify(requests, null, 2), 'utf8');
        console.log('leaveRequests.json updated successfully.');
    } catch (error) {
        console.error('Error writing to leaveRequests.json:', error);
    }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
