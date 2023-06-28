const express = require('express');
const router = express.Router();
const User = require('../userModel');
const jwt = require('jsonwebtoken');


// Login route
router.post('/', (req, res) => {
    const { name, password } = req.body;

    // Check if the name and password are provided
    if (!name || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find the user in the database
    User.findOne({ name, password })
        .then((user) => {
            // If the user doesn't exist
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Check if the password is correct
            if (password !== user.password) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Create a JWT token
            const token = jwt.sign({ role: user.role, name: user.name, id: user.id, email: user.email }, 'secretKey');

            // Send the token in the response
            res.json({ token });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to authenticate '+error });
        });
});


module.exports = router;
