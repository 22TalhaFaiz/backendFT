// authMiddleware.js
function isAuthenticated(req, res, next) {
  console.log('--------------------------------------------');
  console.log('🔹 Checking authentication for request...');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);

  // Log all headers
  console.log('Headers:', req.headers);

  // Log cookies (browser or client)
  console.log('Cookies:', req.headers.cookie || 'No cookies sent');

  // Log session object
  console.log('Session object:', req.session);

  if (req.session && req.session.user) {
    // Attach user object to request
    req.user = req.session.user;
    console.log(`✅ User authenticated: ${req.session.user.name}`);
    console.log('--------------------------------------------');
    return next();
  } else {
    console.warn('⚠️ Unauthorized request detected');
    console.log('Session exists?', !!req.session);
    console.log('Session user exists?', req.session && !!req.session.user);
    console.log('--------------------------------------------');
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }
}

module.exports = isAuthenticated;
