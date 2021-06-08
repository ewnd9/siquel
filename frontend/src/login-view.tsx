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

            const match = /\/join\/(owner|player)\/([\d\w-]+)/.exec(
              window.location.pathname
            );
            console.log(match);
            if (match) {
              io.emit(
                'JOIN_GAME',
                { userType: match[1], roomId: match[2] },
                setState
              );
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
        <button className="ml-2" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
};
