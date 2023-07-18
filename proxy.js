const cors_proxy = require('cors-anywhere');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;

cors_proxy.createServer({
  originWhitelist: [], // Permitir solicitações de qualquer origem
}).listen(port, host, () => {
  console.log(`Proxy CORS Anywhere ouvindo em http://${host}:${port}`);
});
