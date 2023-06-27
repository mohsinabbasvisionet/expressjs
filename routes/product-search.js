const express = require('express');
const router = express.Router();
const Cart = require('../cartModel');
const Product = require('../productModel');
const authenticateUser = require('../middleware/auth');

const isCartUser = require('../middleware/isCartUser');

// Search and add a product to cart
router.post('/', authenticateUser, isCartUser, async (req, res) => {
    try {
        const { keyword } = req.body;

        // Search for products matching the keyword
        const products = await Product.find({ $text: { $search: keyword }, availableQuantity: { $gt: 0 } });
console.log(products);
        // Add the products to cart
        const cartItems = [];
        for (const product of products) {
            const existingCart = await Cart.findOne({ user: req.user.id, product: product.id });
            if (!existingCart) {
                const cartItem = new Cart({
                    user: req.user.id,
                    product: product.id,
                    quantity: 1
                });
                cartItems.push(cartItem);
                await cartItem.save();
            }
        }

        res.status(201).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search and add products to cart' });
    }
});

module.exports = router;