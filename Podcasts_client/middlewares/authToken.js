const jwt = require('jsonwebtoken');
let revokedTokens = [];

// Middleware để xác thực JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    if (revokedTokens.includes(token)) {
      return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
