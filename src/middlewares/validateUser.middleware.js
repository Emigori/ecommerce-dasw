// =============================================================
// Middleware: validateUser
// Verifica que la peticion incluya el header x-user.
// =============================================================

const validateUser = (req, res, next) => {
    const user = req.get('x-user');

    if (!user) {
        return res.status(403).json({
            error: 'Se requiere el header x-user'
        });
    }

    req.userName = user;
    next();
};

module.exports = validateUser;
