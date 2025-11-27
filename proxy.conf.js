const PROXY_CONFIG = {
  "/api": {
    target: "https://natureapi-production.up.railway.app",
    secure: true,
    changeOrigin: true,
    logLevel: "debug"
  }
};

module.exports = PROXY_CONFIG;
