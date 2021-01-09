import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import { State, Socket, SetState } from '../types';

export function useSocketIo(): [State, SetState, Socket] {
  const [state, setState] = useState<State>(null);
  const ioRef = useRef(null);

  useEffect(() => {
    const userId = localStorage['sigame:userId'];
    const socket = io();

    if (userId) {
      socket.emit('LOGIN', { id: userId }, ({ status, state }) => {
        if (status === 'game') {
          onUpdateState(state);
        } else if (status === 'success') {
          socket.emit('CREATE_GAME', {}, onUpdateState);
        } else {
          signUp();
        }
      });
    } else {
      signUp();
    }

    socket.on('UPDATE_STATE', onUpdateState);
    ioRef.current = socket;

    function signUp() {
      socket.emit('SIGN_UP', { username: 'ivan' }, ({ id }) => {
        localStorage['sigame:userId'] = id;
        socket.emit('CREATE_GAME', {}, onUpdateState);
      });
    }

    function onUpdateState(state) {
      console.log({ state });
      setState(state);
    }
  }, []);

  return [state, setState, ioRef.current];
}
