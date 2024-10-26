const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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



const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login attempt with:', { email, password });
    
    try {
        // Convert the password input to a string in case of type mismatch
        const user = await User.findOne({ email: email, password: String(password) });
        console.log('Database query result:', user);

        if (user) {
            // Redirect based on user role
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
            // Redirect to login page with an error message
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
