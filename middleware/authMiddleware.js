const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get token from the header
    // Ideally, headers look like: "Authorization: Bearer <token>"
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    // 2. Extract the actual token (Remove "Bearer " if it's there)
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7, authHeader.length) : authHeader;

    try {
        // 3. Verify the token using your Secret Key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach the user data to the request (req)
        // This lets the next function know EXACTLY who is logged in
        req.user = decoded;
        
        // 5. Allow the request to proceed
        next();

    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};