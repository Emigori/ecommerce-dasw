// =============================================================
// Middleware: validateAdmin
// Verifica que la peticion incluya el header x-auth con valor "admin".
// =============================================================

const validateAdmin = (req, res, next) => {
    const auth = req.get('x-auth');

    if (!auth || auth !== 'admin') {
        return res.status(403).json({
            error: 'Acceso no autorizado, no se cuenta con privilegios de administrador'
        });
    }

    req.isAdmin = true;
    next();
};

module.exports = validateAdmin;
