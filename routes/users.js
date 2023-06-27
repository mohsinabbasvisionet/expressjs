const express = require('express');
const router = express.Router();
const User = require('../userModel');


/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/


//Create new User
router.post('/', (request, response, next) => {
    const {name, password, email, role} = request.body;

    const newUser = new User({
        name,
        password,
        email,
        role,
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

// Read users
router.get('/', (request, response) => {
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
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  User.findOneAndUpdate({ _id: id }, { role })
      .then(() => {
        res.json({ message: 'User Role updated successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to update user' });
      });
});

//find and update
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  User.deleteOne({ _id: id })
      .then(() => {
        res.json({ message: 'User deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to update user' });
      });
});

module.exports = router;
