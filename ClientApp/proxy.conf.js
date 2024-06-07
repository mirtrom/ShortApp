const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:4583';

const PROXY_CONFIG = [
  // {
  //   context: [
  //     "/weatherforecast",
  //   ],
  //   target: target,
  //   secure: false,
  //   ws: true,  // Вказати, що це проксі для WebSocket
  //   headers: {
  //     Connection: 'Keep-Alive'
  //   }
  // },
  // Додайте проксі для WebSocket, якщо ви використовуєте "/ws" для WebSocket
  {
    context: [
      "/ws",
    ],
    target: target,
    secure: false,
    ws: true,  // Вказати, що це проксі для WebSocket
    headers: {
      Connection: 'Upgrade',
      Upgrade: 'websocket'
    }
  }
]

module.exports = PROXY_CONFIG;
