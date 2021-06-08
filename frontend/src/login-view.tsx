import React from 'react';
import { LOGIN_TYPE } from 'shared';

import { Socket, SetState } from './types';

export const LoginView = ({
  io,
  state,
  setState,
}: {
  io: Socket;
  state: LOGIN_TYPE;
  setState: SetState;
}) => {
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          // @ts-ignore
          const username = event.target.elements.username.value;
          // @ts-ignore
          io.emit('SIGN_UP', { username }, (state) => {
            localStorage['sigame:userId'] = state.auth.id;

            const match = /\/room\/([\d\w-]+)/.exec(window.location.pathname);
            if (match) {
              io.emit('JOIN_GAME', { roomId: match[1] }, setState);
            } else {
              setState(state);
            }
          });
        }}
      >
        <input
          type="text"
          name="username"
          required={true}
          placeholder="Username"
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};
