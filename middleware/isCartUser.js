

// Middleware to check if the user is a cart user
const isCartUser = (req, res, next) => {
    if (req.user && req.user.role === 'cart') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};


module.exports = isCartUser;