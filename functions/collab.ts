import type { PagesFunction } from '@cloudflare/workers-types';

const sessions = new Map<WebSocket, string>();

function broadcast(data: unknown) {
  const message = typeof data === 'string' ? data : JSON.stringify(data);

  for (const [socket] of sessions) {
    try {
      socket.send(message);
    } catch {
      // ignore
    }
  }
}

export const onRequest: PagesFunction = async ({ request }) => {
  if (request.headers.get('Upgrade') !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  const pair = new WebSocketPair();
  const [client, server] = Object.values(pair);

  server.accept();

  server.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data as string);

      switch (data.type) {
        case 'join': {
          sessions.set(server, data.userId);
          broadcast({ type: 'presence', users: [...sessions.values()] });
          break;
        }
        case 'chat':
        case 'edit': {
          broadcast(data);
          break;
        }
      }
    } catch {
      // ignore invalid messages
    }
  });

  server.addEventListener('close', () => {
    sessions.delete(server);
    broadcast({ type: 'presence', users: [...sessions.values()] });
  });

  return new Response(null, { status: 101, webSocket: client });
};
