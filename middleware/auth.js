const jwt = require("jsonwebtoken");


const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Missing authentication token' });
    }

    try {
        const decodedToken = jwt.verify(token, 'secretKey');
        req.user = decodedToken;
        console.log("Valid token");
        console.log(req.user);

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication token' });
    }
};

module.exports = authenticateUser;
