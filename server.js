// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// // MongoDB connection
// const mongoURI = "mongodb://localhost:27017/Security";
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB connection error:", err));

// // User schema and model
// const userSchema = new mongoose.Schema({
//     email: String,
//     password: String,
//     role: String,
//     username: String,
// });

// const User = mongoose.model('users', userSchema);

// // Leave Request schema and model
// const leaveRequestSchema = new mongoose.Schema({
//     name: String,
//     branch: String,
//     rollNumber: String,
//     phoneNumber: String,
//     email: String,
//     dateOfLeave: Date,
//     dateOfReturn: Date,
//     createdAt: { type: Date, default: Date.now },
//     status: { type: String, default: 'Pending' }
// });

// const LeaveRequest = mongoose.model('leaveRequests', leaveRequestSchema);

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
    
//     try {
//         const user = await User.findOne({ email: email, password: String(password) });
//         if (user) {
//             switch (user.role) {
//                 case 'student':
//                     return res.redirect('/student');
//                 case 'security':
//                     return res.redirect('/security');
//                 case 'admin':
//                     return res.redirect('/admin');
//                 default:
//                     return res.redirect('/');
//             }
//         } else {
//             res.redirect('/?error=invalid');
//         }
//     } catch (error) {
//         console.error('Error during login process:', error);
//         res.redirect('/?error=server');
//     }
// });

// // Route for each role page
// app.get('/student', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'student.html'));
// });

// app.get('/security', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'security.html'));
// });

// app.get('/admin', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'admin.html'));
// });

// // API to create a leave request
// app.post('/api/leave-requests', async (req, res) => {
//     const { name, branch, rollNumber, phoneNumber, email, dateOfLeave, dateOfReturn } = req.body;
//     console.log("success post");
//     // Create a new LeaveRequest document
//     const newLeaveRequest = new LeaveRequest({
//         name,
//         branch,
//         rollNumber,
//         phoneNumber,
//         email,
//         dateOfLeave,
//         dateOfReturn,
//         createdAt: new Date(), // Timestamp the request creation
//         status: 'Pending', // Default status
//     });

//     try {
//         // Save the new leave request to the database
//         await newLeaveRequest.save();
//         res.status(201).json({ message: 'Leave request submitted successfully.', leaveRequest: newLeaveRequest });
//         console.log("success"); // Respond with success message and the created leave request
//     } catch (error) {
//         console.error('Error saving leave request:', error); // Log any errors that occur
//         res.status(500).json({ message: 'Server error.', error: error.message }); // Respond with an error message
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); // Add file system module for JSON handling
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Add this line to handle JSON data


// MongoDB connection
const mongoURI = "mongodb://localhost:27017/Security";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// User schema and model
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    username: String,
});

const User = mongoose.model('users', userSchema);

// Leave Request schema and model (kept here for reference only; not saving to MongoDB)
const leaveRequestSchema = new mongoose.Schema({
    name: String,
    branch: String,
    rollNumber: String,
    phoneNumber: String,
    email: String,
    dateOfLeave: Date,
    dateOfReturn: Date,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

// Load leave requests from JSON file
const loadLeaveRequests = () => {
    try {
        const data = fs.readFileSync('leaveRequests.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading leaveRequests.json:', error);
        return []; // Return empty array if file read fails
    }
};

// Save leave requests to JSON file
const saveLeaveRequests = (requests) => {
    try {
        fs.writeFileSync('leaveRequests.json', JSON.stringify(requests, null, 2), 'utf8');
        console.log('leaveRequests.json updated successfully.');
    } catch (error) {
        console.error('Error writing to leaveRequests.json:', error);
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email: email, password: String(password) });
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
    } catch (error) {
        console.error('Error during login process:', error);
        res.redirect('/?error=server');
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
// API to create a leave request and save to JSON file
app.post('/api/leave-requests', (req, res) => {
    const { name, branch, rollNumber, phoneNumber, email, dateOfLeave, dateOfReturn } = req.body;
    
    // Log each field to confirm correct data reception
    console.log("Received leave request details:", {
        name, branch, rollNumber, phoneNumber, email, dateOfLeave, dateOfReturn
    });

    // Create new leave request object with all expected fields
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

    try {
        // Load existing requests, add new request, and save back to JSON file
        const requests = loadLeaveRequests();
        requests.push(newLeaveRequest);
        saveLeaveRequests(requests);

        res.status(201).json({ message: 'Leave request submitted successfully.', leaveRequest: newLeaveRequest });
        console.log("Leave request saved to JSON with all fields.");
    } catch (error) {
        console.error('Error saving leave request:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
