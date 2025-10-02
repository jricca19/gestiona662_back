const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (userRole !== requiredRole) {
      return res.status(403).json({ message: "Permiso denegado para este rol" });
    }

    next();
  };
};

module.exports = roleMiddleware;
