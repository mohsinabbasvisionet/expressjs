const express = require('express');
const router = express.Router();
const Cart = require('../cartModel');
const Product = require('../productModel');

const authenticateUser = require('../middleware/auth');

// Middleware to check if the user is a cart user
const isCartUser = require('../middleware/isCartUser');


// Create a new cart item
router.post('/', authenticateUser, isCartUser, async (req, res) => {
    try {
        const { product, quantity } = req.body;

        // Check if the product is available
        const availableProduct = await Product.findById(product);

        if (!availableProduct || availableProduct.availableQuantity <= 0) {
            return res.status(404).json({ error: 'Product not available' });
        }

        // Check if the user already has the product in the cart
        const existingCart = await Cart.findOne({ user: req.user.id, product });
        if (existingCart) {
            return res.status(400).json({ error: 'Product already in cart' });
        }

        // Create a new cart item
        const cartItem = new Cart({
            user: req.user.id,
            product,
            quantity
        });
console.log(cartItem);

        // Save the cart item
        await cartItem.save();

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
});

// Update a cart item
router.put('/:id', authenticateUser, isCartUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        // Check if the cart item exists
        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Update the quantity
        cartItem.quantity = quantity;
        await cartItem.save();

        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cart item' });
    }
});

// Delete a cart item
router.delete('/:id', authenticateUser, isCartUser, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the cart item exists
        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Delete the cart item
        await cartItem.remove();

        res.json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete cart item' });
    }
});

// Get all cart items for the current user
router.get('/', authenticateUser, isCartUser, async (req, res) => {
    try {
        console.log("In cart");
        console.log(req.user.id);
        const cartItems = await Cart.find({ user: req.user.id });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cart items' });
    }
});

module.exports = router;
