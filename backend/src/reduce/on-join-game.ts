import { State } from 'shared';

export interface OnJoinGameAction {
  type: 'JOIN_GAME';
  userId: string;
  username: string;
  userType: 'player' | 'owner';
}

export function onJoinGame(state: State, action: OnJoinGameAction): State {
  const userId = action.userId;
  const username = action.username;

  if (action.userType === 'owner') {
    return {
      ...state,
      ownerId: userId,
    };
  } else {
    const players: State['players'] = {
      ...state.players,
      [userId]: {
        id: userId,
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
}
