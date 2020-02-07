const cfg = require('./src/config');
const server = require('./server');

server.listen(cfg.port, function() {
  console.log(
    `Starting sample-autopilot-support-bot at http://localhost:${cfg.port}`
  );
});
