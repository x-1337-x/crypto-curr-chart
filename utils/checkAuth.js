const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.token;

    if (!token) return res.status(403).end();

    jwt.verify(token, req.app.get('secret'), (err, decoded) => {
        if (err) {
            return res.status(403).json({ err: err.message });
        } else {
            res.locals.user_id = decoded.user_id;
            next();
        }
    });
};

module.exports = checkAuth;
