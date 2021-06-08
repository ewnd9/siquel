import express from 'express';
import { v4 as uuid } from 'uuid';
import { State } from 'shared';

import fs from 'fs';
import path from 'path';
import { Server } from 'http';
import { parseSiq } from './parse-siq';
import { reduce } from './reduce';

const app = express();
const http = new Server(app);
const io = require('socket.io')(http);
const rootDir = path.resolve(`${__dirname}/../..`);
const stateJsonPath = path.resolve(`${rootDir}/data/state.json`);

const packPath = process.env.SIQ_PACK;

if (!fs.existsSync(packPath)) {
  throw new Error(`${packPath} doesn't exist`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const globalState: {
    rooms: Record<string, State>;
    sockets: Record<string, { id: string; username: string; roomId?: string }>;
    users: Record<
      string,
      { id: string; username: string; roomId?: string; socketId?: string }
    >;
  } = fs.existsSync(stateJsonPath)
    ? JSON.parse(fs.readFileSync(stateJsonPath, 'utf-8'))
    : {
        rooms: {},
        sockets: {},
        users: {},
      };

  app.get('/', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/static/gifs', express.static(`${rootDir}/data/gifs`));

  app.get('/api/v1/static/:roomId/:fileId', async (req, res) => {
    const { roomId, fileId } = req.params;
    const state = globalState.rooms[roomId];

    const archiveDir = path.resolve(
      `${rootDir}/data/${state.game.id}-${state.game.version}`
    );

    fs.createReadStream(`${archiveDir}/${fileId}`).pipe(res);
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      const user = globalState.sockets[socket.id];
      delete globalState.sockets[socket.id];

      if (user) {
        delete globalState.users[user.id].socketId;
      }
    });

    socket.on('LOGIN', ({ id }, callback) => {
      console.log('LOGIN', id, socket.id);

      if (globalState.users[id]) {
        globalState.sockets[socket.id] = globalState.users[id];
        globalState.users[id].socketId = socket.id;

        if (globalState.users[id].roomId) {
          const state = globalState.rooms[globalState.users[id].roomId];
          callback({
            status: 'game',
            state: {
              playerView:
                state.ownerId === id ? state.ownerView : state.playerView,
              metaView: state.metaView,
            },
          });
        } else {
          callback({ status: 'success' });
        }
      } else {
        callback({ status: 'error' });
      }

      persistState();
    });

    socket.on('SIGN_UP', ({ username }, callback) => {
      console.log('SIGN_UP', socket.id);
      if (username.trim().length === 0) {
        return;
      }

      const auth = { id: uuid(), username };

      globalState.sockets[socket.id] = auth;
      globalState.users[auth.id] = auth;
      globalState.users[auth.id].socketId = socket.id;

      callback({
        auth,
        playerView: {
          type: 'GAME_LIST',
          gameList: Object.values(globalState.rooms).map((room) => ({
            id: room.roomId,
            players: Object.values(room.players).map(
              (player) => player.username
            ),
          })),
        },
      });

      persistState();
    });

    socket.on('CREATE_GAME', async (_, callback) => {
      console.log('CREATE_GAME', socket.id);

      const roomId = `game-${uuid()}`;
      const { originalContent, game, files, media } = await parseSiq(
        fs.readFileSync(process.argv[2])
      );
      fs.writeFileSync(
        `${rootDir}/test.json`,
        JSON.stringify(originalContent, null, 2)
      );

      const archiveDir = path.resolve(
        `${__dirname}/../../data/${game.id}-${game.version}`
      );

      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });

        for (const [mediaId, fileId] of Object.entries(media)) {
          const file = files[fileId];
          fs.writeFileSync(
            `${archiveDir}/${mediaId}`,
            await file.async('nodebuffer')
          );
        }
      }

      const { id: playerId } = globalState.sockets[socket.id];
      const state = reduce(
        {
          roomId,
          game,
          ownerId: playerId,
          answered: {},
          answers: {},
          players: {},
        },
        { type: 'CREATE_GAME' }
      );

      globalState.rooms[roomId] = state;
      globalState.sockets[socket.id].roomId = roomId;

      callback({
        playerView: state.ownerView,
        metaView: state.metaView,
      });
      persistState();

      return false;
    });

    socket.on('JOIN_GAME', async ({ roomId }) => {
      console.log('JOIN_GAME', socket.id);

      const { id: playerId, username } = globalState.sockets[socket.id];
      const prevState = globalState.rooms[roomId];
      const state = reduce(prevState, {
        type: 'JOIN_GAME',
        playerId,
        username,
      });

      globalState.rooms[roomId] = state;
      globalState.sockets[socket.id].roomId = roomId;
      globalState.users[playerId].roomId = roomId;

      emitGameState(state);
    });

    socket.on('SELECT_QUESTION', ({ id }) => {
      console.log('SELECT_QUESTION', socket.id);

      const { roomId } = globalState.sockets[socket.id];
      const prevState = globalState.rooms[roomId];

      const state = reduce(prevState, { type: 'SELECT_QUESTION', id });
      globalState.rooms[roomId] = state;

      emitGameState(state);
    });

    socket.on('ANSWER_QUESTION', () => {
      console.log('ANSWER_QUESTION', socket.id);

      const { id: playerId, roomId } = globalState.sockets[socket.id];
      const prevState = globalState.rooms[roomId];

      if (prevState.playerView.type !== 'SHOW_QUESTION_VIEW') {
        return;
      }

      const state = reduce(prevState, {
        type: 'ANSWER_QUESTION',
        playerId,
      });
      globalState.rooms[roomId] = state;

      emitGameState(state);
    });

    socket.on('ACK_QUESTION', ({ ack }) => {
      console.log('ACK_QUESTION', socket.id);

      const { roomId } = globalState.sockets[socket.id];
      const prevState = globalState.rooms[roomId];

      const state = reduce(prevState, { type: 'ACK_QUESTION', ack });
      globalState.rooms[roomId] = state;
      emitGameState(state);

      if (state.playerView.type === 'SHOW_ANSWER_VIEW') {
        setTimeout(() => {
          const nextState = reduce(state, { type: 'NEXT_QUESTION' });
          globalState.rooms[roomId] = nextState;
          emitGameState(nextState);
        }, 2);
      }
    });

    socket.on('SKIP_QUESTION', () => {
      console.log('SKIP_QUESTION', socket.id);

      const { roomId } = globalState.sockets[socket.id];
      const prevState = globalState.rooms[roomId];

      const state = reduce(prevState, { type: 'SKIP_QUESTION' });
      globalState.rooms[roomId] = state;
      emitGameState(state);

      if (state.playerView.type === 'SHOW_ANSWER_VIEW') {
        setTimeout(() => {
          const nextState = reduce(state, { type: 'NEXT_QUESTION' });
          globalState.rooms[roomId] = nextState;
          emitGameState(nextState);
        }, 2);
      }
    });

    console.log(`connected`, socket.id);
  });

  http.listen(3000, () => {
    console.log('listening on *:3000');
  });

  function emitGameState(state: State) {
    const ownerId = state.ownerId;
    const players = Object.keys(state.players);

    sendToSocket(globalState.users[ownerId].socketId, {
      playerView: state.ownerView,
      metaView: state.metaView,
    });

    players.forEach((playerId) =>
      sendToSocket(globalState.users[playerId].socketId, {
        playerView: state.playerView,
        metaView: state.metaView,
      })
    );

    persistState();
  }

  function sendToSocket(socketId, state) {
    const x = io.sockets.sockets.get(socketId);
    if (x) {
      x.emit('UPDATE_STATE', state);
    }
  }

  function persistState() {
    fs.writeFileSync(stateJsonPath, JSON.stringify(globalState, null, 2));
  }
}
