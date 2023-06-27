const express = require('express');
const router = express.Router();
const Product = require('../productModel');
const jwt = require('jsonwebtoken');

const authenticateUser = require('../middleware/auth');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};



/*const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, 'your-secret-key');
            req.user = decoded; // Store the decoded user information in the request object
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};*/


// Read users
router.get('/', authenticateUser, isAdmin, async (request, response) => {
    Product.find()
        .then((products) => {
            response.status(200).json(products);
        })
        .catch((err) => {
            response.status(500);
            console.error('Error retrieving users:', err);
        });
});


//Create new Product
router.post('/', authenticateUser, isAdmin, async (request, response) => {
    const {title, description, price, availableQuantity, categories} = request.body;

    const newProduct = new Product({
        title,
        description,
        price,
        availableQuantity,
        categories
    });

    newProduct.save()
        .then(() => {
            console.log('Product created successfully');
            response.status(200).send("Product created successfully");
        })
        .catch((err) => {
            console.error('Error creating product:', err);
            response.status(500).send("some thing went wrong please try again");
        });
});

// Update a product
router.put('/:id', authenticateUser, isAdmin, async (req, res) => {
    try {
        const { title, description, price, availableQuantity, categories } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                price,
                availableQuantity,
                categories,
            },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//find and delete
router.delete('/:id', authenticateUser, isAdmin, async (req, res) => {
  const { id } = req.params;

    Product.deleteOne({ _id: id })
      .then(() => {
        res.json({ message: 'Product deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to update user' });
      });
});


module.exports = router;
