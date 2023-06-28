const express = require('express');
const router = express.Router();
const User = require('../userModel');
//const bcrypt = require("bcrypt");


//signUp User
router.post('/', async (req, res) => {
    try {
        const { name, password, email } = req.body;

        // Hash the password
        //const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database or perform any necessary operations
        // For simplicity, we'll just return the user information
        const user = new User ({
            name,
            password, //: hashedPassword,
            email,
        });

        await user.save()
            .then(() => {
                console.log('User SignUp / created successfully');
                res.status(200).send("User SignUp successfully");
            });
        //res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to sign up' });
    }
});


module.exports = router;
