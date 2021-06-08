import { State } from 'shared';

export interface OnJoinGameAction {
  type: 'JOIN_GAME';
  playerId: string;
  username: string;
}

export function onJoinGame(state: State, action: OnJoinGameAction): State {
  const playerId = action.playerId;
  const username = action.username;

  const players: State['players'] = {
    ...state.players,
    [playerId]: {
      id: playerId,
      username,
      score: 0,
    },
  };

  return {
    ...state,
    players,
    metaView: {
      ...state.metaView,
      players,
    },
  };
}
