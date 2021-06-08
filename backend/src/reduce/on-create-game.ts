import { State } from 'shared';

import { mapRound } from './map-round';

export interface OnCreateGameAction {
  type: 'CREATE_GAME';
}

export function onCreateGame(state: State, _action: OnCreateGameAction): State {
  const roundId = 0;
  const round = mapRound({ state, roundId });

  return {
    ...state,
    roundId,
    playerView: {
      type: 'SELECT_QUESTION_VIEW',
      round,
    },
    ownerView: {
      type: 'OWNER_SELECT_QUESTION_VIEW',
      round,
    },
    metaView: {
      players: state.players,
      roomId: state.roomId,
    },
  };
}
