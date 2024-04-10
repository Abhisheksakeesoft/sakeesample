const PROXY_CONFIG = [
  {
    context: [
      "/api",
    ],
    target: 'https://api.ddmpublic.shop',

    changeOrigin: true,
    secure: false,
    pathRewrite: function (path) {
      console.log("Server Rewrite Request received: " + path);
      var newUrl = path.replace("/api/", "/");
      console.log("Server Rewrite Request received newUrl: " + newUrl);
      return newUrl;
    },
    router: function (req) {
      console.log("Server Request received: " + req.originalUrl);
      var target = 'https://api.ddmpublic.shop'; // or some custom code
      return target;
    },
    logLevel: "debug",
  }
]
module.exports = PROXY_CONFIG;
