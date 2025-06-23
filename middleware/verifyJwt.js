const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if Authorization header exists and is in the correct format
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - Missing or invalid token format' });
    }

    const token = authHeader.split(' ')[1]; // Extract token

    // Verify token
    jwt.verify(
        token,
        process?.env?.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            // Handle token verification errors
            if (err) {
                return res.json({
                    message:` error = ${err.message}`

                })

            }
            

            // Attach user data to the request
            req.user = decoded?.UserInfo?.username;
            req.roles = decoded?.UserInfo?.roles;

            // Proceed to the next middleware
            next();
            
        }
    );
};

module.exports = verifyJWT;