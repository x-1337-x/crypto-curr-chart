const jwt = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.token;

    if (!token) return res.status(403).end();

    try {
        const decoded = await jwt.verify(token, req.app.get('secret'));

        const user = await req.app.get('db').User.findByPk(decoded.user_id);

        if (!user) {
            return res.status(403).end();
        }

        res.locals.user_id = decoded.user_id;

        next();
    } catch (err) {
        return res.status(403).json({ err: err.message });
    }
};

module.exports = checkAuth;
