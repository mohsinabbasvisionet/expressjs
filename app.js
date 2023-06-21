const express = require('express');
const {request, response} = require("express");
const mongoose = require("mongoose");
const app = express();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const path = require("path");
app.use(express.json());

const User = require('./userModel');

/*const uri = "mongodb+srv://expressdb:expressdb123@cluster0.qwvzk0u.mongodb.net/express";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);*/


const connection_Url = "mongodb+srv://expressdb:expressdb123@cluster0.qwvzk0u.mongodb.net/express";
    //"mongodb+srv://expressdb:expressdb123@cluster0.qwvzk0u.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(connection_Url, {}).then(() => {
    console.log("Database Connected");
}).catch((e) => {
    console.log("database error " + e)
});



// Middleware function to secure public routes
const authenticateToken = (req, res, next) => {
    // Extract the JWT token from the request headers
    const token = req.headers.authorization;

    // Check if a token is provided
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, 'secretKey');

        // Attach the decoded token to the request object for further use
        req.user = decodedToken;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Token verification failed
        return res.status(401).json({ error: 'Invalid token' });
    }
};

//Create new User
app.post('/create-users', (request, response) => {
   const {name, password, email} = request.body;

   const newUser = new User({
      name,
      password,
      email,
   });

    newUser.save()
        .then(() => {
            console.log('User created successfully');
            response.status(200).send("User created successfully");
        })
        .catch((err) => {
            console.error('Error creating user:', err);
            response.status(500).send("some thing went wrong please try again");
        });
});


//find and update
app.put('/update-user/:id', (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    User.findOneAndUpdate({ _id: id }, { password })
        .then(() => {
            res.json({ message: 'User password updated successfully' });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update user' });
        });
});


// Read users
app.get('/users', (request, response) => {
    User.find()
        .then((users) => {
            response.status(200).json(users);
        })
        .catch((err) => {
            response.status(500);
            console.error('Error retrieving users:', err);
        });
});


//find and update
app.delete('/delete-user/:id', (req, res) => {
    const { id } = req.params;

    User.deleteOne({ _id: id })
        .then(() => {
            res.json({ message: 'User deleted successfully' });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update user' });
        });
});


// Login route
app.post('/login', (req, res) => {
    const { name, password } = req.body;

    // Check if the name and password are provided
    if (!name || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find the user in the database
    User.findOne({ name })
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
            const token = jwt.sign({ name: user.name }, 'secretKey');

            // Send the token in the response
            res.json({ token });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to authenticate' });
        });
});




// Define a route handler for the root URL
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.get('/about', (request, response) => {
    response.send("About page")
});

app.get('/contact', (request, response) => {
    response.send("Contact page")
});


// Public route
app.get('/public', (req, res) => {
    res.json({ message: 'This is a public route' });
});

// Secured route using the middleware
app.get('/secured', authenticateToken, (req, res) => {
    res.json({ message: 'This is a secured route' });
});






// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
