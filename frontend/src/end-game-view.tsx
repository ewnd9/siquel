import React from 'react';
import { LOGIN_TYPE } from 'shared';

import { Socket, SetState } from './types';

export const EndGameView = ({
  io,
  state,
  setState,
}: {
  io: Socket;
  state: LOGIN_TYPE;
  setState: SetState;
}) => {
  return <div>End Game :)</div>;
};
