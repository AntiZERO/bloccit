const app = require("./app");
const http = require("http");
const port = normalizePort(app);

server.listen(port);

function normalizeport(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

server.on("listening", () => {
  console.log("server is listening for requests on port ${server.address().port}");
});