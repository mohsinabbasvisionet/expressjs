const express = require('express');
const router = express.Router();
const Cart = require('../cartModel');
const authenticateUser = require('../middleware/auth');

const isCartUser = require('../middleware/isCartUser');

// Checkout the cart and update product availableQuantity
router.post('/', authenticateUser, isCartUser, async (req, res) => {
    try {
        const cartItems = await Cart.find({ user: req.user.id }).populate('product');

        console.log(cartItems);

        for (const cartItem of cartItems) {
            const { product, quantity } = cartItem;

            // Check if the product is still available
            if (product.availableQuantity < quantity) {
                return res.status(400).json({ error: 'Product quantity exceeded' });
            }

            // Update the product availableQuantity
            product.availableQuantity -= quantity;
            await product.save();
        }

        // Clear the cart
        await Cart.deleteMany({ user: req.user.id });

        res.json({ message: 'Cart checked out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to checkout cart' });
    }
});


module.exports = router;