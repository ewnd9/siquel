import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { State } from 'shared/src';

import { Socket, SetState } from '../types';

export function useSocketIo(): [State, SetState, Socket] {
  const [state, setState] = useState<State>(null);
  const ioRef = useRef(null);
  const onUpdateState = useCallback((state: State) => {
    console.log({ state });
    setState(state);
  }, []);

  useEffect(() => {
    const userId = localStorage['sigame:userId'];
    const socket = io();

    if (userId) {
      socket.emit('LOGIN', { id: userId }, ({ status, state }) => {
        if (status === 'game') {
          onUpdateState(state);
        } else {
          onUpdateState({ playerView: { type: 'LOGIN' } });
        }
      });
    } else {
      onUpdateState({ playerView: { type: 'LOGIN' } });
    }

    socket.on('UPDATE_STATE', onUpdateState);
    ioRef.current = socket;
  }, [onUpdateState]);

  return [state, onUpdateState, ioRef.current];
}
