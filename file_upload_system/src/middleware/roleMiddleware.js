const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {

    
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Unauthorized: no user info",
      });
    }

    const userRole = req.user.role;

    
    if (!Array.isArray(requiredRoles)) {
      return res.status(500).json({
        message: "Server error: roles must be an array",
      });
    }

    if (requiredRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      message: "Forbidden: insufficient permissions",
    });
  };
};

module.exports = { roleMiddleware };