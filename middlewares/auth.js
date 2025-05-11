const jwt = require('jsonwebtoken');
const SECRET_KEY = 'votre_cle_secrete_super_securisee';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Token manquant');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Token invalide ou expiré');
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;