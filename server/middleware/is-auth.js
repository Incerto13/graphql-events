const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization'); // will assign field and send w/ every request
  if (!authHeader) {
      req.isAuth = false;
      return next();
  }
  const token = authHeader.split(' ')[1]; // example string: Authorization: Bearer JKSDI7DLKJ2UI3ISK
  if (!token || token === '') {
      req.isAuth = false;
      return next();
  }
  let decodedToken;
  try {
      // compare token to secret key that was created at login and saved on server
      decodedToken = jwt.verify(token, 'SOMESUPERSECRETKEY');
  } catch(err) {
      req.isAuth = false;
      return next();
  }
  if (!decodedToken) {
      req.isAuth = false;
      return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
