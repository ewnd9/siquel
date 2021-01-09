import express from 'express';
import { v4 as uuid } from 'uuid';

import fs from 'fs';
import { Server } from 'http';
import { parseSiq } from './parse-siq';
import { reduce } from './reduce';

const app = express();
const http = new Server(app);
const io = require('socket.io')(http);

const siqMap = {};
const rooms = {};
const sockets = {};
const users = {};

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/v1/static/:roomId/:fileId', async (req, res) => {
  const { roomId, fileId } = req.params;
  const { files, media } = siqMap[roomId];
  const file = files[media[fileId]];
  console.log(fileId, media[fileId], !!file, Object.keys(files));

  file.nodeStream().pipe(res);
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    delete sockets[socket.id];
  });

  socket.on('LOGIN', ({ id }, callback) => {
    console.log('LOGIN', id);

    if (users[id]) {
      sockets[socket.id] = users[id];

      if (users[id].roomId) {
        const state = rooms[users[id].roomId];
        callback({
          status: 'game',
          state: {
            playerView: state.playerView,
            metaView: state.metaView,
          },
        });
      } else {
        callback({ status: 'success' });
      }
    } else {
      callback({ status: 'error' });
    }
  });

  socket.on('SIGN_UP', ({ username }, callback) => {
    console.log('SIGN_UP', socket.id);

    const data = { id: uuid(), username };

    sockets[socket.id] = data;
    users[data.id] = data;

    callback(data);
  });

  socket.on('CREATE_GAME', async (_, callback) => {
    console.log('CREATE_GAME', socket.id);

    const roomId = `game-${uuid()}`;
    const { game, files, media } = await parseSiq(
      fs.readFileSync(process.argv[2])
    );

    const { id: playerId, username } = sockets[socket.id];
    const state = reduce(
      {
        roomId,
        game,
        ownerId: socket.id,
        answered: {},
        answers: {},
        players: {
          [playerId]: {
            username,
            score: 0,
          },
        },
      },
      { type: 'CREATE_GAME' }
    );

    siqMap[roomId] = { files, media };
    console.log('here', roomId);
    rooms[roomId] = state;

    socket.join(roomId);
    sockets[socket.id].roomId = roomId;

    callback({
      playerView: state.playerView,
      metaView: state.metaView,
    });

    return false;
  });

  socket.on('SELECT_QUESTION', ({ id }, callback) => {
    console.log('SELECT_QUESTION', socket.id);

    const { roomId } = sockets[socket.id];
    const prevState = rooms[roomId];

    const state = reduce(prevState, { type: 'SELECT_QUESTION', id });
    rooms[roomId] = state;

    callback({
      playerView: state.playerView,
      metaView: state.metaView,
    });
  });

  socket.on('ANSWER_QUESTION', (_, callback) => {
    console.log('ANSWER_QUESTION', socket.id);

    const { id: playerId, roomId } = sockets[socket.id];
    const prevState = rooms[roomId];

    const state = reduce(prevState, {
      type: 'ANSWER_QUESTION',
      playerId,
    });
    rooms[roomId] = state;

    callback({
      playerView: state.playerView,
      metaView: state.metaView,
    });
  });

  socket.on('ACK_QUESTION', ({ ack }, callback) => {
    console.log('ACK_QUESTION', socket.id);

    const { roomId } = sockets[socket.id];
    const prevState = rooms[roomId];

    const state = reduce(prevState, { type: 'ACK_QUESTION', ack });
    rooms[roomId] = state;

    callback({
      playerView: state.playerView,
      metaView: state.metaView,
    });

    if (state.playerView.type === 'SHOW_ANSWER_VIEW') {
      setTimeout(() => {
        const nextState = reduce(state, { type: 'NEXT_QUESTION' });
        rooms[roomId] = nextState;
        socket.emit('UPDATE_STATE', {
          playerView: nextState.playerView,
          metaView: nextState.metaView,
        });
      }, 5000);
    }
  });

  console.log(`connected`, socket.id);
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
